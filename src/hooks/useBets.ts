import { useCallback, useMemo } from 'react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db';
import { GameState, Participant, RoundBet, RoundResult } from '../types/index';
import { DEFAULT_START_BALANCE } from '../utils/participants';

const DEFAULT_GAME_STATE: GameState = {
  id: 'game',
  currentRound: 1,
  totalRounds: 5,
  isComplete: false,
};

const normalizeBetAmount = (amount: number, balance: number) => {
  if (Number.isNaN(amount) || amount <= 0) return 0;
  if (balance < 100) return 0;
  if (amount < 100) return 100;
  return Math.min(amount, balance);
};

export const useBets = () => {
  const gameState =
    useLiveQuery(() => db.game.get('game'), []) || DEFAULT_GAME_STATE;
  const participants =
    useLiveQuery(() => db.participants.orderBy('order').toArray(), []) || [];
  const bets =
    useLiveQuery(
      () =>
        db.bets.where('roundNumber').equals(gameState.currentRound).toArray(),
      [gameState.currentRound],
    ) || [];
  const rounds =
    useLiveQuery(() => db.rounds.orderBy('roundNumber').toArray(), []) || [];

  const betsByBettor = useMemo(() => {
    const map = new Map<string, RoundBet>();
    bets.forEach((bet) => map.set(bet.bettorId, bet));
    return map;
  }, [bets]);

  const pool = useMemo(
    () => bets.reduce((sum, bet) => sum + bet.amount, 0),
    [bets],
  );

  const setBet = useCallback(
    async (bettorId: string, targetId: string, amount: number) => {
      const participant = participants.find((p) => p.id === bettorId);
      const normalizedAmount = normalizeBetAmount(
        amount,
        participant?.balance ?? 0,
      );
      const bet: RoundBet = {
        id: `${gameState.currentRound}:${bettorId}`,
        roundNumber: gameState.currentRound,
        bettorId,
        targetId,
        amount: normalizedAmount,
      };
      await db.bets.put(bet);
    },
    [gameState.currentRound, participants],
  );

  const updateBalance = useCallback(
    async (participantId: string, value: number) => {
      const participant = await db.participants.get(participantId);
      if (!participant) return;
      const nextBalance = Math.max(0, Math.round(value));
      await db.participants.put({ ...participant, balance: nextBalance });
    },
    [],
  );

  const resetGame = useCallback(async () => {
    await db.transaction(
      'rw',
      db.bets,
      db.rounds,
      db.game,
      db.participants,
      async () => {
        await db.bets.clear();
        await db.rounds.clear();
        await db.game.put({ ...DEFAULT_GAME_STATE });
        const currentParticipants = await db.participants.toArray();
        await Promise.all(
          currentParticipants.map((participant, index) =>
            db.participants.put({
              ...participant,
              balance: DEFAULT_START_BALANCE,
              order:
                typeof participant.order === 'number'
                  ? participant.order
                  : index,
            }),
          ),
        );
      },
    );
  }, []);

  const settleRound = useCallback(async (winner: Participant) => {
    const currentState = await db.game.get('game');
    if (!currentState || currentState.isComplete) return;

    const roundNumber = currentState.currentRound;
    const roundBets = await db.bets
      .where('roundNumber')
      .equals(roundNumber)
      .toArray();
    const allParticipants = await db.participants.toArray();

    const poolSum = roundBets.reduce((sum, bet) => sum + bet.amount, 0);
    const totalBetsOnWinner = roundBets.reduce(
      (sum, bet) => (bet.targetId === winner.id ? sum + bet.amount : sum),
      0,
    );

    const participantsById = new Map(
      allParticipants.map((participant) => [participant.id, participant]),
    );

    const betsByBettor = new Map(roundBets.map((bet) => [bet.bettorId, bet]));
    const effectiveBets = allParticipants.map((participant) => {
      const existing = betsByBettor.get(participant.id);
      return (
        existing || {
          id: `${roundNumber}:${participant.id}`,
          roundNumber,
          bettorId: participant.id,
          targetId: participant.id,
          amount: 0,
        }
      );
    });

    const roundResults = effectiveBets.map((bet) => {
      const bettor = participantsById.get(bet.bettorId);
      const target = participantsById.get(bet.targetId);
      const rawPayout =
        bet.amount > 0 && bet.targetId === winner.id && totalBetsOnWinner > 0
          ? (poolSum * bet.amount) / totalBetsOnWinner
          : 0;
      const payout = Math.round(rawPayout);
      return {
        bettorId: bet.bettorId,
        bettorName: bettor?.name ?? 'Неизвестно',
        targetId: bet.targetId,
        targetName: target?.name ?? 'Неизвестно',
        amount: bet.amount,
        payout,
        balanceDelta: payout - bet.amount,
      };
    });

    await db.transaction(
      'rw',
      db.participants,
      db.rounds,
      db.bets,
      db.game,
      async () => {
        for (const betResult of roundResults) {
          const bettor = participantsById.get(betResult.bettorId);
          if (!bettor) continue;
          const nextBalance = Math.max(
            0,
            Math.round(bettor.balance + betResult.balanceDelta),
          );
          participantsById.set(bettor.id, { ...bettor, balance: nextBalance });
        }

        await Promise.all(
          Array.from(participantsById.values()).map((participant) =>
            db.participants.put(participant),
          ),
        );

        const roundResult: RoundResult = {
          id: `round-${roundNumber}`,
          roundNumber,
          winnerId: winner.id,
          winnerName: winner.name,
          pool: poolSum,
          totalBetsOnWinner,
          settledAt: new Date().toISOString(),
          bets: roundResults,
        };
        await db.rounds.put(roundResult);
        await db.bets.where('roundNumber').equals(roundNumber).delete();

        const isComplete = roundNumber >= currentState.totalRounds;
        await db.game.put({
          ...currentState,
          currentRound: isComplete ? roundNumber : roundNumber + 1,
          isComplete,
        });
      },
    );
  }, []);

  const weekWinner = useMemo(() => {
    if (!gameState.isComplete) return null;
    return participants.reduce<Participant | null>(
      (currentWinner, participant) => {
        if (!currentWinner) return participant;
        return participant.balance > currentWinner.balance
          ? participant
          : currentWinner;
      },
      null,
    );
  }, [gameState.isComplete, participants]);

  return {
    gameState,
    participants,
    bets,
    betsByBettor,
    rounds,
    pool,
    weekWinner,
    setBet,
    updateBalance,
    resetGame,
    settleRound,
  };
};
