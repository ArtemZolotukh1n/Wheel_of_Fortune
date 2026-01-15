import { memo } from 'react';
import { CloseButton, PanelHeader, SummaryLine, formatNumber } from '../styles';

export const PortalHeader = memo(
  ({
    roundLabel,
    pool,
    onClose,
  }: {
    roundLabel: string;
    pool: number;
    onClose: () => void;
  }) => (
    <PanelHeader>
      <div>
        <h2 style={{ margin: 0 }}>Ставки</h2>
        <SummaryLine>
          <span>{roundLabel}</span>
          <span>Пул: {formatNumber(pool)}</span>
        </SummaryLine>
      </div>
      <CloseButton onClick={onClose}>✕</CloseButton>
    </PanelHeader>
  ),
);

PortalHeader.displayName = 'PortalHeader';
