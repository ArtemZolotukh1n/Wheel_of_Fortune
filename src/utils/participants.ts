import { Participant } from '../types/index';

export const PARTICIPANTS_STORAGE_KEY = 'wheelOfFortuneParticipants';
export const SETTINGS_STORAGE_KEY = 'wheelOfFortuneSettings';
export const DEFAULT_START_BALANCE = 10000;

type StoredParticipant = {
  id: string;
  name: string;
  addedAt: string;
  balance?: number;
  order?: number;
};

const DEFAULT_PARTICIPANT_NAMES = [
  'Илья М',
  'Илья П',
  'Темочка',
  'Дмитрий',
  'Константин',
];

export const buildDefaultParticipants = (): Participant[] =>
  DEFAULT_PARTICIPANT_NAMES.map((name, index) => ({
    id: String(index + 1),
    name,
    addedAt: new Date(),
    balance: DEFAULT_START_BALANCE,
    order: index,
  }));

export const serializeParticipants = (
  participants: Participant[],
): StoredParticipant[] =>
  participants.map((participant) => ({
    ...participant,
    addedAt: participant.addedAt.toISOString(),
  }));

export const deserializeParticipants = (
  participants: StoredParticipant[],
): Participant[] =>
  participants.map((participant, index) => ({
    ...participant,
    addedAt: new Date(participant.addedAt),
    balance:
      typeof participant.balance === 'number'
        ? participant.balance
        : DEFAULT_START_BALANCE,
    order: typeof participant.order === 'number' ? participant.order : index,
  }));
