import words from '../data/possible-words.json';
import GameEngine from './GameEngine';
import { GameResponse, LetterInfo } from './types';
import { getRandomArbitrary, allPossibleFeedback, isMatch } from './utils';
import * as progress from 'cli-progress';

export default class GuessEngine {
  possibleGuesses: string[];
  engine: GameEngine;

  constructor(engine: GameEngine) {
    this.possibleGuesses = words;
    this.engine = engine;
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
        return !possibleGuess[i].includes(guess[i]);
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

  start() {
    let response: GameResponse | null = null;
    while (response === null || response.status === 'continue') {
      console.log('Determining the best gues...');
      let guess = this.computeBestGuess();
      // let guess =
      //   this.possibleGuesses[
      //     getRandomArbitrary(0, this.possibleGuesses.length - 1)
      //   ];
      response = this.engine.makeGuess(guess);
      this.possibleGuesses = this.handleFeedback(
        guess,
        response.feedback,
        this.possibleGuesses
      );
      console.log(response);
    }
  }
}
