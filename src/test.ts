import possibleTargets from '../data/possible-words.json';
import SimulationEngine from './SimulationEngine';
import GuessEngine from './GuessEngine';

const average = (array) => array.reduce((a, b) => a + b) / array.length;

const targetList = possibleTargets.slice(0, 10);
const main = async () => {
  const results = await Promise.all(
    targetList.map(async (target) => {
      const engine = new GuessEngine(new SimulationEngine(target));
      const response = await engine.start();
      return response.numGuesses;
    })
  );

  console.log(`------ Average: ${average(results)} ------`);
};

main();
