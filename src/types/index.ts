export type SongNames =
  | 'baraban_default.mp3'
  | 'baraban_1995.mp3'
  | 'napas.mp3'
  | 'volchok.mp3';

export type SpinDirection = 'по часовой' | 'против часовой';

export interface Participant {
  id: string;
  name: string;
  addedAt: Date;
}

export interface WheelState {
  participants: Participant[];
  spinning: boolean;
  rotation: number;
  winner: Participant | null;
  showWinnerPopup: boolean;
}

export interface AudioSettings {
  volume: number;
  track: SongNames;
}

export interface SpinSettings {
  direction: SpinDirection;
  duration: number;
  minRotations: number;
  maxRotations: number;
}

export interface AppState {
  wheel: WheelState;
  audio: AudioSettings;
  spin: SpinSettings;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface ParticipantValidationResult {
  isValid: boolean;
  error?: ValidationError;
}
