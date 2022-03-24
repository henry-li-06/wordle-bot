import words from '../data/words.json';
import GameEngine from './GameEngine';
import { GameResponse, LetterInfo } from './types';
import {
  getRandomArbitrary,
  allPossibleFeedback,
  isMatch,
  sleep,
} from './utils';
import * as progress from 'cli-progress';

export default class GuessEngine {
  possibleGuesses: string[];
  engine: GameEngine;
  numGuesses: number;

  constructor(engine: GameEngine) {
    sleep(3000);
    this.possibleGuesses = words;
    this.engine = engine;
    this.numGuesses = 0;
  }

  private static handleGreyFeedback(
    guess: string,
    feedback: LetterInfo[],
    possibleGuess: string,
    pos: number
  ) {
    const letter = guess[pos];
    const containsOther = guess
      .split('')
      .some((it, i) => i !== pos && it === letter && feedback[i] !== 'grey');
    if (!containsOther) return !possibleGuess.includes(letter);
    return possibleGuess[pos] !== guess[pos];
  }

  private handleFeedback(
    guess: string,
    feedback: LetterInfo[],
    wordList: string[]
  ): string[] {
    let remainingGuesses;
    guess.split('').forEach((letter, i) => {
      wordList = wordList.filter((possibleGuess) => {
        if (feedback[i] === 'green') return possibleGuess[i] === guess[i];
        if (feedback[i] === 'yellow')
          return (
            possibleGuess.includes(guess[i]) && possibleGuess[i] !== guess[i]
          );

        return GuessEngine.handleGreyFeedback(
          guess,
          feedback,
          possibleGuess,
          i
        );
      });
      remainingGuesses = wordList;
    });
    return remainingGuesses;
  }

  private computeInformationGain(
    guess: string,
    feedback: LetterInfo[]
  ): number {
    let remainingGuesses = [...this.possibleGuesses];
    remainingGuesses = this.handleFeedback(guess, feedback, remainingGuesses);
    return remainingGuesses.length === 0
      ? 0
      : -Math.log2(remainingGuesses.length / this.possibleGuesses.length);
  }

  computeBestGuess(): string {
    if (this.numGuesses === 0) {
      this.numGuesses++;
      sleep(3000);
      return 'slate';
    }
    const bar = new progress.SingleBar({}, progress.Presets.legacy);
    bar.start(this.possibleGuesses.length, 0);

    const expectedInformationGains = this.possibleGuesses.map((guess, i) => {
      const probabilities = allPossibleFeedback.map((feedback) => {
        let numMatches = 0;
        this.possibleGuesses.forEach((word) => {
          if (isMatch(word, guess, feedback)) numMatches++;
        });
        return {
          probability: numMatches / this.possibleGuesses.length,
          feedback,
        };
      });
      let expectedInformationGain = 0;

      probabilities.forEach((val) => {
        expectedInformationGain +=
          val.probability * this.computeInformationGain(guess, val.feedback);
      });
      bar.update(i + 1);
      return { expectedInformationGain, guess };
    });
    bar.stop();
    const sorted = expectedInformationGains.sort(
      (v1, v2) => v2.expectedInformationGain - v1.expectedInformationGain
    );
    return sorted[0].guess;
  }

  async start() {
    let response: GameResponse | null = null;
    while (response === null || response.status === 'continue') {
      console.log('Determining the best guess...');
      let guess = this.computeBestGuess();
      response = await this.engine.makeGuess(guess);
      this.possibleGuesses = this.handleFeedback(
        guess,
        response.feedback,
        this.possibleGuesses
      );
      console.log(response);
    }
    return response;
  }
}
