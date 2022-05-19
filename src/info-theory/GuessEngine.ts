import words from '../../data/words.json';
import GameEngine from './GameEngine';
import { GameResponse, LetterInfo, GameState } from '../types';
import { allPossibleFeedback, isMatch, sleep, computeFeedback } from '../utils';
import * as progress from 'cli-progress';

const MAX_GUESSES = 6;

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

  private static minimax(
    isMaxTurn: boolean,
    state: GameState,
    alpha: number,
    beta: number,
    depth: number,
    maxDepth: number
  ): number {
    // console.log('minimax');
    if (state.status === 'correct') return 1 / state.numGuesses;
    if (depth >= maxDepth) {
      return 0;
    }
    if (isMaxTurn) {
      let bestScore = -Infinity;
      state.wordList.every((word) => {
        const newState: GameState = {
          ...state,
          guess: word,
          numGuesses: state.numGuesses + 1,
          status:
            state.wordList.length === 0 && word === state.wordList[0]
              ? 'correct'
              : 'continue',
        };
        const value = GuessEngine.minimax(
          !isMaxTurn,
          newState,
          alpha,
          beta,
          depth + 1,
          maxDepth
        );
        bestScore = Math.max(bestScore, value);
        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) return false;
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      state.wordList.forEach((word) => {
        const feedback = computeFeedback(state.guess, word);
        const remainingPossibleGuesses = GuessEngine.handleFeedback(
          state.guess,
          feedback,
          state.wordList
        );
        const newState: GameState = {
          ...state,
          status:
            remainingPossibleGuesses.length === 1 ? 'correct' : 'continue',
          wordList: remainingPossibleGuesses,
        };
        const value = GuessEngine.minimax(
          !isMaxTurn,
          newState,
          alpha,
          beta,
          depth,
          maxDepth
        );
        bestScore = Math.min(value, bestScore);
        beta = Math.min(beta, bestScore);
        if (beta <= alpha) return false;
      });
      return bestScore;
    }
  }

  private static handleAbsentFeedback(
    guess: string,
    feedback: LetterInfo[],
    possibleGuess: string,
    pos: number
  ) {
    const letter = guess[pos];
    const containsOther = guess
      .split('')
      .some((it, i) => i !== pos && it === letter && feedback[i] !== 'absent');
    if (!containsOther) return !possibleGuess.includes(letter);
    return possibleGuess[pos] !== guess[pos];
  }

  private static handleFeedback(
    guess: string,
    feedback: LetterInfo[],
    wordList: string[]
  ): string[] {
    let remainingGuesses;
    guess.split('').forEach((letter, i) => {
      wordList = wordList.filter((possibleGuess) => {
        if (feedback[i] === 'correct') return possibleGuess[i] === guess[i];
        if (feedback[i] === 'present')
          return (
            possibleGuess.includes(guess[i]) && possibleGuess[i] !== guess[i]
          );

        return GuessEngine.handleAbsentFeedback(
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
    remainingGuesses = GuessEngine.handleFeedback(
      guess,
      feedback,
      remainingGuesses
    );
    return remainingGuesses.length === 0
      ? 0
      : -Math.log2(remainingGuesses.length / this.possibleGuesses.length);
  }

  computeBestGuess(): string {
    if (this.possibleGuesses.length <= 10)
      return this.computeBestGuessWithMinimax();
    else return this.computeBestGuessWithInformationGain();
  }

  computeBestGuessWithMinimax(): string {
    const state: GameState = {
      numGuesses: 0,
      status: 'continue',
      wordList: [...this.possibleGuesses],
      guess: '',
      chosenTarget: '',
    };
    let bestScore = -Infinity;
    let bestWord = '';
    state.wordList.forEach((word) => {
      const newState: GameState = {
        ...state,
        guess: word,
        numGuesses: state.numGuesses + 1,
        status:
          state.wordList.length === 0 && word === state.wordList[0]
            ? 'correct'
            : 'continue',
      };
      const score = GuessEngine.minimax(
        true,
        newState,
        -Infinity,
        Infinity,
        0,
        MAX_GUESSES - this.numGuesses
      );
      if (score > bestScore) {
        bestScore = score;
        bestWord = word;
      }
    });
    return bestWord;
  }

  computeBestGuessWithInformationGain(): string {
    if (this.numGuesses === 0) {
      this.numGuesses++;
      sleep(3000);
      return 'soare';
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
      this.possibleGuesses = GuessEngine.handleFeedback(
        guess,
        response.feedback,
        this.possibleGuesses
      );
      console.log(response);
    }
    return response;
  }
}
