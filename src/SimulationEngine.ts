import { GameResponse } from './types';
import GameEngine from './GameEngine';
import { isValidWord } from './utils';

export default class SimulationEngine extends GameEngine {
  maxGuesses = 6;

  target: string;
  numGuesses: number;

  constructor(target: string) {
    super();
    if (!isValidWord(target)) throw new Error();
    this.target = target.toLowerCase();
    this.numGuesses = 0;
  }

  makeGuess(guess: string): GameResponse {
    if (!isValidWord(guess) || this.numGuesses >= this.maxGuesses)
      throw new Error();

    this.numGuesses++;
    guess = guess.toLowerCase();
    const feedback = guess.split('').map((letter, i) => {
      if (letter === this.target[i]) return 'green';
      if (this.target.includes(letter)) return 'yellow';
      return 'grey';
    });
    const status =
      guess === this.target
        ? 'correct'
        : this.numGuesses === this.maxGuesses
        ? 'finished'
        : 'continue';
    return { status, feedback, numGuesses: this.numGuesses, guess };
  }
}
