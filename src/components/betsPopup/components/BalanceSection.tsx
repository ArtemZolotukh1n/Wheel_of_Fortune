import { memo } from 'react';
import { Participant } from '../../../types';
import { capitalize } from '../../../utils';
import { Field, Grid, Row, Section, SectionTitle } from '../styles';

const BalanceRow = memo(
  ({
    participant,
    onBalanceChange,
  }: {
    participant: Participant;
    onBalanceChange: (participantId: string, value: number) => void;
  }) => (
    <Row>
      <div>{capitalize(participant.name)}</div>
      <Field
        type="number"
        min={0}
        value={participant.balance}
        onChange={(event) =>
          onBalanceChange(participant.id, Number(event.target.value))
        }
      />
      <div />
    </Row>
  ),
);

BalanceRow.displayName = 'BalanceRow';

export const BalanceSection = memo(
  ({
    participants,
    onBalanceChange,
  }: {
    participants: Participant[];
    onBalanceChange: (participantId: string, value: number) => void;
  }) => (
    <Section>
      <SectionTitle>Баланс участников</SectionTitle>
      <Grid>
        <strong>Участник</strong>
        <strong>Баланс</strong>
        <div />
      </Grid>
      {participants.map((participant) => (
        <BalanceRow
          key={`balance-${participant.id}`}
          participant={participant}
          onBalanceChange={onBalanceChange}
        />
      ))}
    </Section>
  ),
);

BalanceSection.displayName = 'BalanceSection';
