import { memo } from 'react';
import { Participant } from '../../../types';
import { capitalize } from '../../../utils';
import {
  Field,
  Grid,
  Row,
  Section,
  SectionTitle,
  Select,
  SummaryLine,
} from '../styles';

const BetRow = memo(
  ({
    participant,
    amount,
    targetId,
    isDisabled,
    options,
    onAmountChange,
    onTargetChange,
  }: {
    participant: Participant;
    amount: number;
    targetId: string;
    isDisabled: boolean;
    options: { id: string; name: string }[];
    onAmountChange: (bettorId: string, targetId: string, value: number) => void;
    onTargetChange: (
      bettorId: string,
      amount: number,
      targetId: string,
    ) => void;
  }) => (
    <Row>
      <div>{capitalize(participant.name)}</div>
      <Field
        type="number"
        min={0}
        value={amount}
        disabled={isDisabled}
        onChange={(event) => {
          const nextValue =
            event.target.value === '' ? 0 : Number(event.target.value);
          onAmountChange(participant.id, targetId, nextValue);
        }}
      />
      <Select
        value={targetId}
        disabled={isDisabled}
        onChange={(event) =>
          onTargetChange(participant.id, amount, event.target.value)
        }
      >
        {options.map((option) => (
          <option key={option.id} value={option.id}>
            {capitalize(option.name)}
          </option>
        ))}
      </Select>
    </Row>
  ),
);

BetRow.displayName = 'BetRow';

export const BetsSection = memo(
  ({
    participants,
    isDisabled,
    betsByBettor,
    options,
    onAmountChange,
    onTargetChange,
  }: {
    participants: Participant[];
    isDisabled: boolean;
    betsByBettor: Map<string, { amount: number; targetId: string }>;
    options: { id: string; name: string }[];
    onAmountChange: (bettorId: string, targetId: string, value: number) => void;
    onTargetChange: (
      bettorId: string,
      amount: number,
      targetId: string,
    ) => void;
  }) => (
    <Section>
      <SectionTitle>Ставки текущего раунда</SectionTitle>
      <Grid>
        <strong>Кто ставит</strong>
        <strong>Сумма</strong>
        <strong>На кого</strong>
      </Grid>
      {participants.map((participant) => {
        const bet = betsByBettor.get(participant.id);
        const amount = bet?.amount ?? 100;
        const targetId = bet?.targetId ?? participant.id;
        return (
          <BetRow
            key={`bet-${participant.id}`}
            participant={participant}
            amount={amount}
            targetId={targetId}
            isDisabled={isDisabled}
            options={options}
            onAmountChange={onAmountChange}
            onTargetChange={onTargetChange}
          />
        );
      })}
      <SummaryLine>
        Минимальная ставка — 100, допускается 0.
        {isDisabled && ' Неделя завершена, ставки закрыты.'}
      </SummaryLine>
    </Section>
  ),
);

BetsSection.displayName = 'BetsSection';
