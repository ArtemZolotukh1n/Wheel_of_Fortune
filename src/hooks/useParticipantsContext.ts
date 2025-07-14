import React, { createContext, useContext } from 'react';
import {
  ParticipantsAction,
  ParticipantsState,
} from '../context/ParticipantsContext';

interface ParticipantsContextType {
  state: ParticipantsState;
  dispatch: React.Dispatch<ParticipantsAction>;
}

export const ParticipantsContext = createContext<
  ParticipantsContextType | undefined
>(undefined);

export const useParticipantsContext = (): ParticipantsContextType => {
  const context = useContext(ParticipantsContext);
  if (context === undefined) {
    throw new Error(
      'useParticipantsContext должен использоваться внутри ParticipantsProvider',
    );
  }
  return context;
};

export type { ParticipantsAction };
