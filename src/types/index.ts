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
  balance: number;
  order: number;
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

export interface AppSettings {
  audioVolume: number;
  audioTrack: SongNames;
  spinDirection: SpinDirection;
}

export interface GameState {
  id: 'game';
  currentRound: number;
  totalRounds: number;
  isComplete: boolean;
}

export interface RoundBet {
  id: string;
  roundNumber: number;
  bettorId: string;
  targetId: string;
  amount: number;
}

export interface RoundBetResult {
  bettorId: string;
  bettorName: string;
  targetId: string;
  targetName: string;
  amount: number;
  payout: number;
  balanceDelta: number;
}

export interface RoundResult {
  id: string;
  roundNumber: number;
  winnerId: string;
  winnerName: string;
  pool: number;
  totalBetsOnWinner: number;
  settledAt: string;
  bets: RoundBetResult[];
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
