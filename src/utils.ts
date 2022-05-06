import { LetterInfo } from './types';

export const isValidWord = (word: string): boolean =>
  word.length === 5 && word.split('').every((letter) => isLetter(letter));

const isLetter = (str: string) =>
  str.length === 1 && str.toLowerCase() !== str.toUpperCase();

export const getRandomArbitrary = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const computeAllPossibleFeedback = (len: number): LetterInfo[][] => {
  if (len === 1) return [['correct'], ['present'], ['absent']];

  const possiblities: LetterInfo[] = ['correct', 'present', 'absent'];
  const result: LetterInfo[][] = [];
  possiblities.forEach((color) => {
    let possibleFeedbacks = computeAllPossibleFeedback(len - 1);
    possibleFeedbacks.forEach((feedback) => {
      const infoList = [color, ...feedback];
      result.push(infoList);
    });
  });
  return result;
};

export const allPossibleFeedback = computeAllPossibleFeedback(5);

export const isMatch = (
  word: string,
  guess: string,
  feedback: LetterInfo[]
): boolean => {
  return guess.split('').every((letter, i) => {
    switch (feedback[i]) {
      case 'correct':
        return letter === word[i];
      case 'present':
        return word.includes(letter);
      case 'absent':
        return !word.includes(letter);
    }
  });
};

export const sleep = (delay) =>
  new Promise((resolve) => setTimeout(resolve, delay));

export const computeFeedback = (word: string, target: string): LetterInfo[] => {
  const feedback: LetterInfo[] = [];
  word.split('').forEach((letter, i) => {
    if (letter === target[i]) feedback.push('correct');
    else if (target.includes(letter)) feedback.push('present');
    else feedback.push('absent');
  });
  return feedback;
};
