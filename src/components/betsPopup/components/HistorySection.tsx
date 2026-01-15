import { memo } from 'react';
import { RoundResult } from '../../../types';
import { capitalize } from '../../../utils';
import { Section, SectionTitle, SummaryLine, formatNumber } from '../styles';

export const HistorySection = memo(({ rounds }: { rounds: RoundResult[] }) => (
  <Section>
    <SectionTitle>История раундов</SectionTitle>
    {rounds.length === 0 && <div>Пока нет завершённых раундов.</div>}
    {rounds.map((round) => (
      <div key={round.id} style={{ marginBottom: '12px' }}>
        <strong>
          Раунд {round.roundNumber}: победитель {capitalize(round.winnerName)}
        </strong>
        <SummaryLine>
          <span>Пул: {formatNumber(round.pool)}</span>
          <span>На победителя: {formatNumber(round.totalBetsOnWinner)}</span>
        </SummaryLine>
        <div style={{ marginTop: '8px', fontSize: '14px' }}>
          {round.bets.map((bet, index) => (
            <div key={`${round.id}-bet-${index}`}>
              {capitalize(bet.bettorName)} → {capitalize(bet.targetName)}:
              ставка {formatNumber(bet.amount)}, выплата{' '}
              {formatNumber(bet.payout)}, Δ {formatNumber(bet.balanceDelta)}
            </div>
          ))}
        </div>
      </div>
    ))}
  </Section>
));

HistorySection.displayName = 'HistorySection';
