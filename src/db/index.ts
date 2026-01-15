import Dexie, { Table } from 'dexie';
import {
  AppSettings,
  GameState,
  Participant,
  RoundBet,
  RoundResult,
} from '../types/index';
import {
  buildDefaultParticipants,
  DEFAULT_START_BALANCE,
  deserializeParticipants,
  PARTICIPANTS_STORAGE_KEY,
  SETTINGS_STORAGE_KEY,
} from '../utils/participants';

const DEFAULT_SETTINGS: AppSettings = {
  audioVolume: 30,
  audioTrack: 'baraban_default.mp3',
  spinDirection: 'по часовой',
};

const DEFAULT_GAME_STATE: GameState = {
  id: 'game',
  currentRound: 1,
  totalRounds: 5,
  isComplete: false,
};

class WheelDB extends Dexie {
  participants!: Table<Participant, string>;
  settings!: Table<AppSettings & { id: 'app' }, 'app'>;
  game!: Table<GameState, 'game'>;
  bets!: Table<RoundBet, string>;
  rounds!: Table<RoundResult, string>;

  constructor() {
    super('wheelOfFortuneDb');

    this.version(1).stores({
      participants: 'id, order, name',
      settings: 'id',
      game: 'id',
      bets: 'id, roundNumber, bettorId, targetId',
      rounds: 'id, roundNumber',
    });
  }
}

export const db = new WheelDB();

const ensureParticipantsHaveOrderAndBalance = async () => {
  const participants = await db.participants.toArray();
  if (participants.length === 0) return;

  const needsUpdate = participants.some(
    (participant) =>
      typeof participant.order !== 'number' ||
      typeof participant.balance !== 'number',
  );
  if (!needsUpdate) return;

  await db.transaction('rw', db.participants, async () => {
    for (const [index, participant] of participants.entries()) {
      const order =
        typeof participant.order === 'number' ? participant.order : index;
      const balance =
        typeof participant.balance === 'number'
          ? participant.balance
          : DEFAULT_START_BALANCE;
      await db.participants.put({ ...participant, order, balance });
    }
  });
};

const migrateFromLocalStorage = async () => {
  if (typeof window === 'undefined') return;

  const existingParticipantsCount = await db.participants.count();
  const hasParticipants = existingParticipantsCount > 0;

  if (!hasParticipants) {
    const storedParticipants = window.localStorage.getItem(
      PARTICIPANTS_STORAGE_KEY,
    );
    if (storedParticipants) {
      try {
        const parsed = JSON.parse(storedParticipants);
        const participants = deserializeParticipants(parsed).map(
          (participant, index) => ({
            ...participant,
            balance: DEFAULT_START_BALANCE,
            order: index,
          }),
        );
        if (participants.length > 0) {
          await db.participants.bulkAdd(participants);
        }
        window.localStorage.removeItem(PARTICIPANTS_STORAGE_KEY);
      } catch (error) {
        console.warn('Ошибка миграции участников из localStorage:', error);
      }
    }
  }

  const hasSettings = (await db.settings.count()) > 0;
  if (!hasSettings) {
    const storedSettings = window.localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (storedSettings) {
      try {
        const parsed = JSON.parse(storedSettings);
        await db.settings.put({ id: 'app', ...DEFAULT_SETTINGS, ...parsed });
        window.localStorage.removeItem(SETTINGS_STORAGE_KEY);
      } catch (error) {
        console.warn('Ошибка миграции настроек из localStorage:', error);
      }
    }
  }
};

export const ensureDbSeed = async () => {
  await db.open();

  await migrateFromLocalStorage();

  const participantsCount = await db.participants.count();
  if (participantsCount === 0) {
    await db.participants.bulkAdd(buildDefaultParticipants());
  }

  const settings = await db.settings.get('app');
  if (!settings) {
    await db.settings.put({ id: 'app', ...DEFAULT_SETTINGS });
  }

  const gameState = await db.game.get('game');
  if (!gameState) {
    await db.game.put(DEFAULT_GAME_STATE);
  }

  await ensureParticipantsHaveOrderAndBalance();
};

export const updateSettings = async (partial: Partial<AppSettings>) => {
  const existing = await db.settings.get('app');
  await db.settings.put({
    id: 'app',
    ...DEFAULT_SETTINGS,
    ...existing,
    ...partial,
  });
};
