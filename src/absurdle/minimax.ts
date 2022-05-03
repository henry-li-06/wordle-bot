import { workerData } from 'worker_threads';
import { GameState } from './types';
import { LetterInfo } from '../types';

const computeFeedback = (word: string, target: string): LetterInfo[] => {
  const feedback = [];
  word.split('').forEach((letter, i) => {
    if (letter === target[i]) feedback.push('green');
    else if (target.includes(letter)) feedback.push('yellow');
    else feedback.push('grey');
  });
  return feedback;
};

const handleGreyFeedback = (
  guess: string,
  feedback: LetterInfo[],
  possibleGuess: string,
  pos: number
) => {
  const letter = guess[pos];
  const containsOther = guess
    .split('')
    .some((it, i) => i !== pos && it === letter && feedback[i] !== 'grey');
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
      if (feedback[i] === 'green') return possibleGuess[i] === guess[i];
      if (feedback[i] === 'yellow')
        return (
          possibleGuess.includes(guess[i]) && possibleGuess[i] !== guess[i]
        );

      return handleGreyFeedback(guess, feedback, possibleGuess, i);
    });
    remainingGuesses = wordList;
  });
  return remainingGuesses;
};

const findBestWord = (state: GameState) => {
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
    const score = minimax(false, newState);
    if (score > bestScore) {
      bestScore = score;
      bestWord = word;
    }
  });
  return bestWord;
};

const minimax = (isMaxTurn: boolean, state: GameState): number => {
  if (state.status === 'correct') return 1 / state.numGuesses;
  const scores: number[] = [];
  state.wordList.forEach((word) => {
    let newState: GameState;
    if (isMaxTurn) {
      newState = {
        ...state,
        guess: word,
        numGuesses: state.numGuesses + 1,
        status:
          state.wordList.length === 0 && word === state.wordList[0]
            ? 'correct'
            : 'continue',
      };
      scores.push(minimax(!isMaxTurn, newState));
    } else {
      const feedback = computeFeedback(state.guess, word);
      const remainingPossibleGuesses = handleFeedback(
        state.guess,
        feedback,
        state.wordList
      );
      const newState = {
        ...state,
        wordList: remainingPossibleGuesses,
      };
    }
    scores.push(minimax(!isMaxTurn, newState));
  });
  return isMaxTurn ? Math.max(...scores) : Math.min(...scores);
};

/*
  minimax(maximizing: boolean, state) {
    if(board.is_terminal) {
      return the valuation of the state 
    }
    scores = []
    for move in possible moves:
      make move 
      scores.add(minimax(!maximizing, state))
      board.revert_move()
    return maximizing ? max(score) : min(score)
  }


*/
