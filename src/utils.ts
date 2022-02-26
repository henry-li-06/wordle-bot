export const isValidWord = (word: string): boolean =>
  word.length === 5 && word.split('').every((letter) => isLetter(letter));

const isLetter = (str: string) =>
  str.length === 1 && str.toLowerCase() !== str.toUpperCase();

export const getRandomArbitrary = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
