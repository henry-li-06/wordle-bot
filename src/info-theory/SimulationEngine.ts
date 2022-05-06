import { GameResponse } from '../types';
import GameEngine from './GameEngine';
import { isValidWord } from '../utils';

const MAX_GUESSES = 6;

export default class SimulationEngine extends GameEngine {
  target: string;
  constructor(target: string) {
    super();
    if (!isValidWord(target)) throw new Error();
    this.target = target.toLowerCase();
    this.numGuesses = 0;
  }

  async makeGuess(guess: string): Promise<GameResponse> {
    if (!isValidWord(guess) || this.numGuesses >= MAX_GUESSES)
      throw new Error();

    this.numGuesses++;
    guess = guess.toLowerCase();
    const feedback = guess.split('').map((letter, i) => {
      if (letter === this.target[i]) return 'correct';
      if (this.target.includes(letter)) return 'present';
      return 'absent';
    });
    const status =
      guess === this.target
        ? 'correct'
        : this.numGuesses === MAX_GUESSES
        ? 'finished'
        : 'continue';
    return { status, feedback, numGuesses: this.numGuesses, guess };
  }
}
