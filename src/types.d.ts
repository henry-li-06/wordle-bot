export type GameResponse = {
  status: GameStatus;
  feedback: LetterInfo[];
  numGuesses: number;
  guess: string;
};

export type GameStatus = 'correct' | 'finished' | 'continue';

export type LetterInfo = 'green' | 'yellow' | 'grey';
