import { GameResponse } from '../types';

export default abstract class GameEngine {
  numGuesses: number;
  abstract makeGuess(word: string): Promise<GameResponse>;
  constructor() {
    this.numGuesses = 0;
  }
}
