import possibleTargets from '../data/possible-words.json';
import SimulationEngine from './info-theory/SimulationEngine';
import GuessEngine from './info-theory/GuessEngine';
import _ from 'lodash';
import * as fs from 'fs';

const average = (array) => array.reduce((a, b) => a + b) / array.length;

const main = async () => {
  const description = process.argv[2];
  const size = process.argv[3];

  const targetList = _.sampleSize(
    possibleTargets,
    size ? Number(size) : possibleTargets.length
  );

  const results = await Promise.all(
    targetList.map(async (target) => {
      const engine = new GuessEngine(new SimulationEngine(target));
      const response = await engine.start();
      return response.numGuesses;
    })
  );

  console.log(`------ Average: ${average(results)} ------`);
  const outputString = `Description: ${description}\n${average(results)}\n\n`;
  fs.appendFile('./logs/log.txt', outputString, (err) => {
    if (err) console.log(err);
    console.log(__dirname);
  });
};

main();
