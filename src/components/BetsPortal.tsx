import React, { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import styled from 'styled-components';
import { useBets } from '../hooks/useBets';
import { capitalize } from '../utils';

const Fab = styled.button`
  position: fixed;
  right: 24px;
  bottom: 24px;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: #ffb300;
  color: #1f1f1f;
  font-size: 22px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.35);
  z-index: 1200;
`;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(3px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1300;
`;

const Panel = styled.div`
  width: min(960px, 92vw);
  height: min(92vh, 900px);
  background: #0f131a;
  color: #ffffff;
  border-radius: 16px;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4);
  overflow: hidden;
`;

const PanelHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: #ffffff;
  font-size: 20px;
  cursor: pointer;
`;

const Section = styled.section`
  background: #151b26;
  border-radius: 12px;
  padding: 16px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 12px 0;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, 1fr) 120px minmax(160px, 1fr);
  gap: 12px;

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Row = styled.div`
  display: grid;
  grid-template-columns: minmax(140px, 1fr) 120px minmax(160px, 1fr);
  gap: 12px;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  @media (max-width: 720px) {
    grid-template-columns: 1fr;
  }
`;

const Field = styled.input`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #2e3748;
  background: #0f131a;
  color: #ffffff;
`;

const Select = styled.select`
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #2e3748;
  background: #0f131a;
  color: #ffffff;
`;

const ScrollArea = styled.div`
  overflow: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-right: 6px;
`;

const SummaryLine = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  font-size: 14px;
  opacity: 0.85;
`;

const ResetButton = styled.button`
  align-self: flex-start;
  padding: 8px 12px;
  border-radius: 8px;
  border: none;
  background: #ff5f5f;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
`;

const formatNumber = (value: number) =>
  new Intl.NumberFormat('ru-RU', { maximumFractionDigits: 0 }).format(value);

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

  return (
    <>
      <Fab onClick={() => setIsOpen(true)} aria-label="Открыть ставки">
        ₽
      </Fab>
      {isOpen &&
        createPortal(
          <Overlay onClick={() => setIsOpen(false)}>
            <Panel onClick={(event) => event.stopPropagation()}>
              <PanelHeader>
                <div>
                  <h2 style={{ margin: 0 }}>Ставки</h2>
                  <SummaryLine>
                    <span>{roundLabel}</span>
                    <span>Пул: {formatNumber(pool)}</span>
                  </SummaryLine>
                </div>
                <CloseButton onClick={() => setIsOpen(false)}>✕</CloseButton>
              </PanelHeader>

              {weekWinner && (
                <Section>
                  <SectionTitle>Победитель недели</SectionTitle>
                  <div>
                    {capitalize(weekWinner.name)} —{' '}
                    {formatNumber(weekWinner.balance)} очков
                  </div>
                </Section>
              )}

              <ScrollArea>
                <Section>
                  <SectionTitle>Баланс участников</SectionTitle>
                  <Grid>
                    <strong>Участник</strong>
                    <strong>Баланс</strong>
                    <div />
                  </Grid>
                  {participants.map((participant) => (
                    <Row key={`balance-${participant.id}`}>
                      <div>{capitalize(participant.name)}</div>
                      <Field
                        type="number"
                        min={0}
                        value={participant.balance}
                        onChange={(event) =>
                          updateBalance(
                            participant.id,
                            Number(event.target.value),
                          )
                        }
                      />
                      <div />
                    </Row>
                  ))}
                </Section>

                <Section>
                  <SectionTitle>Ставки текущего раунда</SectionTitle>
                  <Grid>
                    <strong>Кто ставит</strong>
                    <strong>Сумма</strong>
                    <strong>На кого</strong>
                  </Grid>
                  {participants.map((participant) => {
                    const bet = betsByBettor.get(participant.id);
                    const amount = bet?.amount ?? 0;
                    const targetId = bet?.targetId ?? participant.id;
                    return (
                      <Row key={`bet-${participant.id}`}>
                        <div>{capitalize(participant.name)}</div>
                        <Field
                          type="number"
                          min={0}
                          value={amount}
                          disabled={gameState.isComplete}
                          onChange={(event) => {
                            const nextValue =
                              event.target.value === ''
                                ? 0
                                : Number(event.target.value);
                            void setBet(participant.id, targetId, nextValue);
                          }}
                        />
                        <Select
                          value={targetId}
                          disabled={gameState.isComplete}
                          onChange={(event) =>
                            void setBet(
                              participant.id,
                              event.target.value,
                              amount,
                            )
                          }
                        >
                          {participants.map((target) => (
                            <option key={target.id} value={target.id}>
                              {capitalize(target.name)}
                            </option>
                          ))}
                        </Select>
                      </Row>
                    );
                  })}
                  <SummaryLine>
                    Минимальная ставка — 100, допускается 0.
                    {gameState.isComplete &&
                      ' Неделя завершена, ставки закрыты.'}
                  </SummaryLine>
                </Section>

                <Section>
                  <SectionTitle>История раундов</SectionTitle>
                  {rounds.length === 0 && (
                    <div>Пока нет завершённых раундов.</div>
                  )}
                  {rounds.map((round) => (
                    <div key={round.id} style={{ marginBottom: '12px' }}>
                      <strong>
                        Раунд {round.roundNumber}: победитель{' '}
                        {capitalize(round.winnerName)}
                      </strong>
                      <SummaryLine>
                        <span>Пул: {formatNumber(round.pool)}</span>
                        <span>
                          На победителя: {formatNumber(round.totalBetsOnWinner)}
                        </span>
                      </SummaryLine>
                      <div style={{ marginTop: '8px', fontSize: '14px' }}>
                        {round.bets.map((bet, index) => (
                          <div key={`${round.id}-bet-${index}`}>
                            {capitalize(bet.bettorName)} →{' '}
                            {capitalize(bet.targetName)}: ставка{' '}
                            {formatNumber(bet.amount)}, выплата{' '}
                            {formatNumber(bet.payout)}, Δ{' '}
                            {formatNumber(bet.balanceDelta)}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </Section>
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
