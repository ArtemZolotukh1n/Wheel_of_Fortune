import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { useBets } from '../../hooks/useBets';
import {
  BalanceSection,
  BetsSection,
  HistorySection,
  PortalHeader,
  WeekWinnerBanner,
} from './components';
import { Fab, Overlay, Panel, ResetButton, ScrollArea } from './styles';

export const BetsPortal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    gameState,
    participants,
    betsByBettor,
    rounds,
    pool,
    weekWinner,
    setBet,
    updateBalance,
    resetGame,
  } = useBets();

  const roundLabel = useMemo(() => {
    if (gameState.isComplete) {
      return `Неделя завершена (${gameState.totalRounds} раундов)`;
    }
    return `Раунд ${gameState.currentRound} из ${gameState.totalRounds}`;
  }, [gameState.currentRound, gameState.isComplete, gameState.totalRounds]);

  const betOptions = useMemo(
    () =>
      participants.map((participant) => ({
        id: participant.id,
        name: participant.name,
      })),
    [participants],
  );

  const handleClose = useCallback(() => setIsOpen(false), []);
  const handleOpen = useCallback(() => setIsOpen(true), []);

  const handleBalanceChange = useCallback(
    (participantId: string, value: number) => {
      void updateBalance(participantId, value);
    },
    [updateBalance],
  );

  const handleAmountChange = useCallback(
    (bettorId: string, targetId: string, value: number) => {
      void setBet(bettorId, targetId, value);
    },
    [setBet],
  );

  const handleTargetChange = useCallback(
    (bettorId: string, amount: number, targetId: string) => {
      void setBet(bettorId, targetId, amount);
    },
    [setBet],
  );

  useEffect(() => {
    if (!isOpen || gameState.isComplete) return;
    const missing = participants.filter(
      (participant) => !betsByBettor.has(participant.id),
    );
    if (missing.length === 0) return;
    missing.forEach((participant) => {
      void setBet(participant.id, participant.id, 100);
    });
  }, [isOpen, gameState.isComplete, participants, betsByBettor, setBet]);

  return (
    <>
      <Fab onClick={handleOpen} aria-label="Открыть ставки">
        ₽
      </Fab>
      {isOpen &&
        createPortal(
          <Overlay onClick={handleClose}>
            <Panel onClick={(event) => event.stopPropagation()}>
              <PortalHeader
                roundLabel={roundLabel}
                pool={pool}
                onClose={handleClose}
              />
              <WeekWinnerBanner winner={weekWinner} />
              <ScrollArea>
                <BalanceSection
                  participants={participants}
                  onBalanceChange={handleBalanceChange}
                />
                <BetsSection
                  participants={participants}
                  betsByBettor={betsByBettor}
                  options={betOptions}
                  isDisabled={gameState.isComplete}
                  onAmountChange={handleAmountChange}
                  onTargetChange={handleTargetChange}
                />
                <HistorySection rounds={rounds} />
              </ScrollArea>
              <ResetButton onClick={() => void resetGame()}>
                Reset недели
              </ResetButton>
            </Panel>
          </Overlay>,
          document.body,
        )}
    </>
  );
};
