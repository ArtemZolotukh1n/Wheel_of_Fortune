import React from 'react';
import {
  AppState,
  Participant,
  SongNames,
  SpinDirection,
} from '../types/index';

export type AppAction =
  | { type: 'ADD_PARTICIPANT'; payload: Participant }
  | { type: 'REMOVE_PARTICIPANT'; payload: string }
  | { type: 'SHUFFLE_PARTICIPANTS' }
  | { type: 'SORT_PARTICIPANTS' }
  | { type: 'SET_SPINNING'; payload: boolean }
  | { type: 'SET_ROTATION'; payload: number }
  | { type: 'SET_WINNER'; payload: Participant | null }
  | { type: 'SET_WINNER_POPUP'; payload: boolean }
  | { type: 'SET_AUDIO_VOLUME'; payload: number }
  | { type: 'SET_AUDIO_TRACK'; payload: SongNames }
  | { type: 'SET_SPIN_DIRECTION'; payload: SpinDirection }
  | { type: 'RESET_WHEEL' }
  | { type: 'LOAD_PARTICIPANTS'; payload: Participant[] }
  | {
      type: 'LOAD_SETTINGS';
      payload: { volume: number; track: SongNames; direction: SpinDirection };
    }
  | { type: 'RESET_PARTICIPANTS' };

// Алгоритм перемешивания Fisher-Yates
export const shuffleArray = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}
