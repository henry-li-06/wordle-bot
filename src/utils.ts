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
  if (len === 1) return [['green'], ['yellow'], ['grey']];

  const possiblities: LetterInfo[] = ['green', 'yellow', 'grey'];
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
      case 'green':
        return letter === word[i];
      case 'yellow':
        return word.includes(letter);
      case 'grey':
        return !word.includes(letter);
    }
  });
};

export const convertFeedback = (feedback: string[]): LetterInfo[] =>
  feedback.map((info) => {
    switch (info) {
      case 'present':
        return 'yellow';
      case 'absent':
        return 'grey';
      case 'correct':
        return 'green';
      default:
        throw new Error();
    }
  });
