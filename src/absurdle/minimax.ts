import { GameState } from './types';
import { LetterInfo } from '../types';

const computeFeedback = (word: string, target: string): LetterInfo[] => {
  const feedback: LetterInfo[] = [];
  word.split('').forEach((letter, i) => {
    if (letter === target[i]) feedback.push('correct');
    else if (target.includes(letter)) feedback.push('present');
    else feedback.push('absent');
  });
  return feedback;
};

const handleAbsentFeedback = (
  guess: string,
  feedback: LetterInfo[],
  possibleGuess: string,
  pos: number
) => {
  const letter = guess[pos];
  const containsOther = guess
    .split('')
    .some((it, i) => i !== pos && it === letter && feedback[i] !== 'absent');
  if (!containsOther) return !possibleGuess.includes(letter);
  return possibleGuess[pos] !== guess[pos];
};

const handleFeedback = (
  guess: string,
  feedback: LetterInfo[],
  wordList: string[]
): string[] => {
  let remainingGuesses;
  guess.split('').forEach((letter, i) => {
    wordList = wordList.filter((possibleGuess) => {
      if (feedback[i] === 'correct') return possibleGuess[i] === guess[i];
      if (feedback[i] === 'present')
        return (
          possibleGuess.includes(guess[i]) && possibleGuess[i] !== guess[i]
        );

      return handleGreyFeedback(guess, feedback, possibleGuess, i);
    });
    remainingGuesses = wordList;
  });
  return remainingGuesses;
};

export const findBestWord = (state: GameState) => {
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
    const score = minimax(false, newState, -Infinity, Infinity, 0);
    if (score > bestScore) {
      bestScore = score;
      bestWord = word;
    }
  });
  return bestWord;
};

const minimax = (
  isMaxTurn: boolean,
  state: GameState,
  alpha: number,
  beta: number,
  depth: number
): number => {
  console.log(depth);
  if (state.status === 'correct') return 1;
  // if (isMaxTurn && depth >= 3) {
  //   return 1 / state.wordList.length;
  // }
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
      const value = minimax(!isMaxTurn, newState, alpha, beta, depth + 1);
      bestScore = Math.max(bestScore, value);
      alpha = Math.max(alpha, bestScore);
      if (beta <= alpha) return false;
    });
    return bestScore;
  } else {
    let bestScore = Infinity;
    state.wordList.forEach((word) => {
      const feedback = computeFeedback(state.guess, word);
      const remainingPossibleGuesses = handleFeedback(
        state.guess,
        feedback,
        state.wordList
      );
      const newState: GameState = {
        ...state,
        status: remainingPossibleGuesses.length === 1 ? 'correct' : 'continue',
        wordList: remainingPossibleGuesses,
      };
      const value = minimax(!isMaxTurn, newState, alpha, beta, depth + 1);
      bestScore = Math.min(value, bestScore);
      beta = Math.min(beta, bestScore);
      if (beta <= alpha) return false;
    });
    return bestScore;
  }
};
