import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  ReactNode,
} from 'react';
import {
  Participant,
  SongNames,
  SpinDirection,
  WheelState,
  AudioSettings,
  SpinSettings,
  AppSettings,
} from '../types/index';
import { db } from '../db';

export type WheelAction =
  | { type: 'SET_SPINNING'; payload: boolean }
  | { type: 'SET_ROTATION'; payload: number }
  | { type: 'SET_WINNER'; payload: Participant | null }
  | { type: 'SET_WINNER_POPUP'; payload: boolean }
  | { type: 'SET_AUDIO_VOLUME'; payload: number }
  | { type: 'SET_AUDIO_TRACK'; payload: SongNames }
  | { type: 'SET_SPIN_DIRECTION'; payload: SpinDirection }
  | { type: 'LOAD_SETTINGS'; payload: AppSettings }
  | { type: 'RESET_WHEEL' };

interface WheelContextState {
  wheel: WheelState;
  audio: AudioSettings;
  spin: SpinSettings;
}

interface WheelContextType {
  state: WheelContextState;
  dispatch: React.Dispatch<WheelAction>;
}

const defaultSettings: AppSettings = {
  audioVolume: 30,
  audioTrack: 'baraban_default.mp3',
  spinDirection: 'по часовой',
};

const wheelReducer = (
  state: WheelContextState,
  action: WheelAction,
): WheelContextState => {
  switch (action.type) {
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

    case 'LOAD_SETTINGS':
      return {
        ...state,
        audio: {
          ...state.audio,
          volume: action.payload.audioVolume,
          track: action.payload.audioTrack,
        },
        spin: {
          ...state.spin,
          direction: action.payload.spinDirection,
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

    default:
      return state;
  }
};

const WheelContext = createContext<WheelContextType | undefined>(undefined);

interface WheelProviderProps {
  children: ReactNode;
}

export const WheelProvider: React.FC<WheelProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(wheelReducer, {
    wheel: {
      participants: [], // Участники управляются через IndexedDB
      spinning: false,
      rotation: 0,
      winner: null,
      showWinnerPopup: false,
    },
    audio: {
      volume: defaultSettings.audioVolume,
      track: defaultSettings.audioTrack,
    },
    spin: {
      direction: defaultSettings.spinDirection,
      duration: 6000,
      minRotations: 5,
      maxRotations: 10,
    },
  });

  useEffect(() => {
    let isMounted = true;
    db.settings
      .get('app')
      .then((settings) => {
        if (settings && isMounted) {
          dispatch({
            type: 'LOAD_SETTINGS',
            payload: {
              audioVolume: settings.audioVolume,
              audioTrack: settings.audioTrack,
              spinDirection: settings.spinDirection,
            },
          });
        }
      })
      .catch((error) => {
        console.warn('Ошибка загрузки настроек из IndexedDB:', error);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <WheelContext.Provider value={{ state, dispatch }}>
      {children}
    </WheelContext.Provider>
  );
};

export const useWheelContext = (): WheelContextType => {
  const context = useContext(WheelContext);
  if (context === undefined) {
    throw new Error(
      'useWheelContext должен использоваться внутри WheelProvider',
    );
  }
  return context;
};
