
export interface Mood {
  emoji: string;
  label: string;
}

export interface CardData {
  date: string;
  day: string;
  monthYear: string;
  mood: string;
  quote: string;
  themeColor: string; // New field for dynamic background
}

export enum AppState {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  RESULT = 'RESULT'
}
