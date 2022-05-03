// import GuessEngine from './info-theory/GuessEngine';
// import BrowserEngine from './info-theory/BrowserEngine';

// const engine = new GuessEngine(new BrowserEngine());
// engine.start();

export type CharStatus = 'absent' | 'present' | 'correct';

export const getStatuses = (
  solution: string,
  guesses: string[]
): { [key: string]: CharStatus } => {
  const charObj: { [key: string]: CharStatus } = {};
  const splitSolution = solution.split('');

  guesses.forEach((word) => {
    word.split('').forEach((letter, i) => {
      if (!splitSolution.includes(letter)) {
        // make status absent
        return (charObj[letter] = 'absent');
      }

      if (letter === splitSolution[i]) {
        //make status correct
        return (charObj[letter] = 'correct');
      }

      if (charObj[letter] !== 'correct') {
        //make status present
        return (charObj[letter] = 'present');
      }
    });
  });

  return charObj;
};

console.log(getStatuses('hello', ['soare']));
