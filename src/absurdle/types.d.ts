export interface GameState {
  numGuesses: number;
  status: 'continue' | 'correct';
  wordList: string[];
  guess: string;
  chosenTarget: string;
}
