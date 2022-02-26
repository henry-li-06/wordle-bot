export type GameResponse = {
  status: GameStatus;
  feedback: LetterInfo[];
  numGuesses: number;
  guess: string;
};

type GameStatus = 'correct' | 'finished' | 'continue';

export type LetterInfo = 'green' | 'yellow' | 'grey';
