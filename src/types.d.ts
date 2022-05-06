export type GameResponse = {
  status: GameStatus;
  feedback: LetterInfo[];
  numGuesses: number;
  guess: string;
};

export type GameStatus = 'correct' | 'finished' | 'continue';

export type LetterInfo = 'correct' | 'present' | 'absent';

export interface GameState {
  numGuesses: number;
  status: 'continue' | 'correct';
  wordList: string[];
  guess: string;
  chosenTarget: string;
}
