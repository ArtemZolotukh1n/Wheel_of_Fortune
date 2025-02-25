import React from 'react';
import { Button, ButtonsContainer } from './styles';
import { capitalize } from './utils';
import { SpinDirection } from './types';

interface ISpinButtonsProps {
  spinDirection: SpinDirection;
  changeSpinDirection: () => void;
  startSpin: () => void;
  spinning: boolean;
  participants: string[];
}

export const SpinButtons = React.memo(
  ({
    spinDirection,
    changeSpinDirection,
    startSpin,
    spinning,
    participants,
  }: ISpinButtonsProps) => (
    <ButtonsContainer>
      <Button
        onClick={changeSpinDirection}
        disabled={participants.length === 0 || spinning}
      >
        {capitalize(spinDirection)}
      </Button>
      <Button
        onClick={startSpin}
        disabled={participants.length === 0 || spinning}
      >
        Круть
      </Button>
    </ButtonsContainer>
  ),
);
