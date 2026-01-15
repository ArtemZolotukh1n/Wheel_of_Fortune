import React from 'react';
import { Button, ButtonsContainer } from './styles';
import { capitalize } from './utils';
import { SpinDirection, Participant } from './types/index';

interface ISpinButtonsProps {
  spinDirection: SpinDirection;
  changeSpinDirection: () => void;
  startSpin: () => void;
  spinning: boolean;
  participants: Participant[];
  isGameComplete: boolean;
}

export const SpinButtons = React.memo(
  ({
    spinDirection,
    changeSpinDirection,
    startSpin,
    spinning,
    participants,
    isGameComplete,
  }: ISpinButtonsProps) => (
    <ButtonsContainer>
      <Button
        onClick={changeSpinDirection}
        disabled={participants.length === 0 || spinning || isGameComplete}
      >
        {capitalize(spinDirection)}
      </Button>
      <Button
        onClick={startSpin}
        disabled={participants.length === 0 || spinning || isGameComplete}
      >
        Круть
      </Button>
    </ButtonsContainer>
  ),
);
