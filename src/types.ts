export type GameResponse = {
  status: GameStatus;
  feedback: LetterInfo[];
  numGuesses: number;
};

type GameStatus = 'correct' | 'finished' | 'continue';

type LetterInfo = 'green' | 'yellow' | 'grey';
