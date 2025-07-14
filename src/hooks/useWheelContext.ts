import React, { createContext, useContext } from 'react';
import { WheelState } from '../types';
import { WheelAction } from '../context/WheelContext';

interface WheelContextType {
  state: WheelState;
  dispatch: React.Dispatch<WheelAction>;
}

export const WheelContext = createContext<WheelContextType | undefined>(
  undefined,
);

export const useWheelContext = (): WheelContextType => {
  const context = useContext(WheelContext);
  if (context === undefined) {
    throw new Error(
      'useWheelContext должен использоваться внутри WheelProvider',
    );
  }
  return context;
};

export type { WheelAction };
