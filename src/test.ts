import possibleTargets from '../data/possible-words.json';
import SimulationEngine from './info-theory/SimulationEngine';
import GuessEngine from './info-theory/GuessEngine';
import _ from 'lodash';

const average = (array) => array.reduce((a, b) => a + b) / array.length;

const main = async (description: string, size = possibleTargets.length) => {
  console.log(description);
  const targetList = _.sampleSize(possibleTargets, size);
  const results = await Promise.all(
    targetList.map(async (target) => {
      const engine = new GuessEngine(new SimulationEngine(target));
      const response = await engine.start();
      return response.numGuesses;
    })
  );

  console.log(`------ Average: ${average(results)} ------`);
};

const description = process.argv[2];
const size = process.argv[3];

main(description, Number(size));
