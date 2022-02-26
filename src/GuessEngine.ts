import words from '../data/words.json';
import GameEngine from './GameEngine';
import { GameResponse, LetterInfo } from './types';
import { getRandomArbitrary } from './utils';

export default class GuessEngine {
  possibleGuesses: string[];
  engine: GameEngine;

  constructor(engine: GameEngine) {
    this.possibleGuesses = words;
    this.engine = engine;
  }

  private handleFeedback(guess: string, feedback: LetterInfo[]) {
    guess.split('').forEach((letter, i) => {
      this.possibleGuesses = this.possibleGuesses.filter((possibleGuess) => {
        if (feedback[i] === 'green') return possibleGuess[i] === guess[i];
        if (feedback[i] === 'yellow')
          return (
            possibleGuess.includes(guess[i]) && possibleGuess[i] !== guess[i]
          );
        return !possibleGuess[i].includes(guess[i]);
      });
    });
  }

  start() {
    let response: GameResponse | null = null;
    while (response === null || response.status === 'continue') {
      let guess =
        this.possibleGuesses[
          getRandomArbitrary(0, this.possibleGuesses.length - 1)
        ];
      response = this.engine.makeGuess(guess);
      this.handleFeedback(guess, response.feedback);
      console.log(response);
    }
  }
}
