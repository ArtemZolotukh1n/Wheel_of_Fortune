import React, { createContext, useReducer, ReactNode } from 'react';
import { AppState } from '../types/index';
import { AppAction, AppContextType, shuffleArray } from './types';

// Загружаем участников из localStorage
const loadParticipantsFromStorage = () => {
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

  return [
    { id: '1', name: 'Илья М', addedAt: new Date() },
    { id: '2', name: 'Илья П', addedAt: new Date() },
    { id: '3', name: 'Темочка', addedAt: new Date() },
    { id: '4', name: 'Павел', addedAt: new Date() },
    { id: '5', name: 'Дмитрий', addedAt: new Date() },
    { id: '6', name: 'Константин', addedAt: new Date() },
  ];
};

// Загружаем настройки из localStorage
const loadSettingsFromStorage = () => {
  try {
    const stored = localStorage.getItem('wheelOfFortuneSettings');
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.warn('Ошибка загрузки настроек из localStorage:', error);
  }

  return {
    audioVolume: 30,
    audioTrack: 'baraban_default.mp3',
    spinDirection: 'по часовой',
  };
};

const getInitialState = (): AppState => {
  const settings = loadSettingsFromStorage();

  return {
    wheel: {
      participants: loadParticipantsFromStorage(),
      spinning: false,
      rotation: 0,
      winner: null,
      showWinnerPopup: false,
    },
    audio: {
      volume: settings.audioVolume,
      track: settings.audioTrack,
    },
    spin: {
      direction: settings.spinDirection,
      duration: 6000,
      minRotations: 5,
      maxRotations: 10,
    },
  };
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_PARTICIPANT':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          participants: [...state.wheel.participants, action.payload],
        },
      };

    case 'REMOVE_PARTICIPANT':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          participants: state.wheel.participants.filter(
            (p) => p.id !== action.payload,
          ),
        },
      };

    case 'SHUFFLE_PARTICIPANTS':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          participants: shuffleArray(state.wheel.participants),
        },
      };

    case 'SORT_PARTICIPANTS':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          participants: [...state.wheel.participants].sort((a, b) =>
            a.name.localeCompare(b.name),
          ),
        },
      };

    case 'SET_SPINNING':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          spinning: action.payload,
        },
      };

    case 'SET_ROTATION':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          rotation: action.payload,
        },
      };

    case 'SET_WINNER':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          winner: action.payload,
        },
      };

    case 'SET_WINNER_POPUP':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          showWinnerPopup: action.payload,
        },
      };

    case 'SET_AUDIO_VOLUME':
      return {
        ...state,
        audio: {
          ...state.audio,
          volume: action.payload,
        },
      };

    case 'SET_AUDIO_TRACK':
      return {
        ...state,
        audio: {
          ...state.audio,
          track: action.payload,
        },
      };

    case 'SET_SPIN_DIRECTION':
      return {
        ...state,
        spin: {
          ...state.spin,
          direction: action.payload,
        },
      };

    case 'RESET_WHEEL':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          spinning: false,
          rotation: 0,
          winner: null,
          showWinnerPopup: false,
        },
      };

    case 'LOAD_PARTICIPANTS':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          participants: action.payload,
        },
      };

    case 'LOAD_SETTINGS':
      return {
        ...state,
        audio: {
          ...state.audio,
          volume: action.payload.volume,
          track: action.payload.track,
        },
        spin: {
          ...state.spin,
          direction: action.payload.direction,
        },
      };

    case 'RESET_PARTICIPANTS':
      return {
        ...state,
        wheel: {
          ...state.wheel,
          participants: [
            { id: '1', name: 'Илья М', addedAt: new Date() },
            { id: '2', name: 'Илья П', addedAt: new Date() },
            { id: '3', name: 'Темочка', addedAt: new Date() },
            { id: '4', name: 'Павел', addedAt: new Date() },
            { id: '5', name: 'Дмитрий', addedAt: new Date() },
            { id: '6', name: 'Константин', addedAt: new Date() },
          ],
        },
      };

    default:
      return state;
  }
};

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, getInitialState());

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
