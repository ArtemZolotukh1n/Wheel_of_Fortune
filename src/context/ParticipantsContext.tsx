import React, { useReducer, ReactNode } from 'react';
import { Participant } from '../types/index';
import { ParticipantsContext } from '../hooks/useParticipantsContext';

// Типы действий для участников
export type ParticipantsAction =
  | { type: 'ADD_PARTICIPANT'; payload: Participant }
  | { type: 'REMOVE_PARTICIPANT'; payload: string }
  | { type: 'SHUFFLE_PARTICIPANTS' }
  | { type: 'SORT_PARTICIPANTS' }
  | { type: 'RESET_PARTICIPANTS' }
  | { type: 'LOAD_PARTICIPANTS'; payload: Participant[] };

export interface ParticipantsState {
  participants: Participant[];
}

// Алгоритм перемешивания Fisher-Yates
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Загружаем участников из localStorage
const loadParticipantsFromStorage = (): Participant[] => {
  try {
    const stored = localStorage.getItem('wheelOfFortuneParticipants');
    if (stored) {
      const parsed = JSON.parse(stored);
      return parsed.map((p: { id: string; name: string; addedAt: string }) => ({
        ...p,
        addedAt: new Date(p.addedAt),
      }));
    }
  } catch (error) {
    console.warn('Ошибка загрузки участников из localStorage:', error);
  }

  // Дефолтные участники
  return [
    { id: '1', name: 'Илья М', addedAt: new Date() },
    { id: '2', name: 'Илья П', addedAt: new Date() },
    { id: '3', name: 'Темочка', addedAt: new Date() },
    { id: '4', name: 'Павел', addedAt: new Date() },
    { id: '5', name: 'Дмитрий', addedAt: new Date() },
    { id: '6', name: 'Константин', addedAt: new Date() },
  ];
};

// Редьюсер для участников
const participantsReducer = (
  state: ParticipantsState,
  action: ParticipantsAction,
): ParticipantsState => {
  switch (action.type) {
    case 'ADD_PARTICIPANT':
      return {
        ...state,
        participants: [...state.participants, action.payload],
      };

    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        participants: state.participants.filter((p) => p.id !== action.payload),
      };

    case 'SHUFFLE_PARTICIPANTS':
      return {
        ...state,
        participants: shuffleArray(state.participants),
      };

    case 'SORT_PARTICIPANTS':
      return {
        ...state,
        participants: [...state.participants].sort((a, b) =>
          a.name.localeCompare(b.name),
        ),
      };

    case 'RESET_PARTICIPANTS':
      return {
        ...state,
        participants: [
          { id: '1', name: 'Илья М', addedAt: new Date() },
          { id: '2', name: 'Илья П', addedAt: new Date() },
          { id: '3', name: 'Темочка', addedAt: new Date() },
          { id: '4', name: 'Павел', addedAt: new Date() },
          { id: '5', name: 'Дмитрий', addedAt: new Date() },
          { id: '6', name: 'Константин', addedAt: new Date() },
        ],
      };

    case 'LOAD_PARTICIPANTS':
      return {
        ...state,
        participants: action.payload,
      };

    default:
      return state;
  }
};

interface ParticipantsProviderProps {
  children: ReactNode;
}

export const ParticipantsProvider: React.FC<ParticipantsProviderProps> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(participantsReducer, {
    participants: loadParticipantsFromStorage(),
  });

  return (
    <ParticipantsContext.Provider value={{ state, dispatch }}>
      {children}
    </ParticipantsContext.Provider>
  );
};
