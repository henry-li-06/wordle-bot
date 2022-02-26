import { GameResponse } from './types';

export default class SimulationEngine {
  maxGuesses = 6;

  target: string;
  numGuesses: number;

  constructor(target: string) {
    if (!SimulationEngine.isValidWord(target)) throw new Error();
    this.target = target.toLowerCase();
    this.numGuesses = 0;
  }

  makeGuess(guess: string): GameResponse {
    if (
      !SimulationEngine.isValidWord(guess) ||
      this.numGuesses >= this.maxGuesses
    )
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
    return { status, feedback, numGuesses: this.numGuesses };
  }

  private static isLetter(str: string) {
    return str.length === 1 && str.toLowerCase() !== str.toUpperCase();
  }

  private static isValidWord(word: string): boolean {
    return (
      word.length === 5 &&
      word.split('').every((letter) => SimulationEngine.isLetter(letter))
    );
  }
}
