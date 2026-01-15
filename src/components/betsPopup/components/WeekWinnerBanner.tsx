import { memo } from 'react';
import { Participant } from '../../../types';
import { capitalize } from '../../../utils';
import { Section, SectionTitle, formatNumber } from '../styles';

export const WeekWinnerBanner = memo(
  ({ winner }: { winner: Participant | null }) => {
    if (!winner) return null;
    return (
      <Section>
        <SectionTitle>Победитель недели</SectionTitle>
        <div>
          {capitalize(winner.name)} — {formatNumber(winner.balance)} очков
        </div>
      </Section>
    );
  },
);

WeekWinnerBanner.displayName = 'WeekWinnerBanner';
