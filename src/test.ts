import possibleTargets from '../data/possible-words.json';
import SimulationEngine from './info-theory/SimulationEngine';
import GuessEngine from './info-theory/GuessEngine';
import _ from 'lodash';
import * as fs from 'fs';
import { Worker } from 'worker_threads';

const average = (array) => array.reduce((a, b) => a + b) / array.length;

function standardDeviation(array) {
  const n = array.length;
  const mean = array.reduce((a, b) => a + b) / n;
  return Math.sqrt(
    array.map((x) => Math.pow(x - mean, 2)).reduce((a, b) => a + b) / n
  );
}

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

  const avg = average(results);
  const std = standardDeviation(results);

  //* Logging
  console.log(`Average:\t${avg} `);
  console.log(`Standard Deviation:\t${std}`);
  const outputString = `${process.argv}\nDescription: ${description}\nAverage: ${avg}\nStandard Deviation: ${std}\n\n`;
  fs.appendFile('./logs/log.txt', outputString, (err) => {
    if (err) console.log(err);
    console.log(__dirname);
  });
};

// const main = () => {
//   const number = 10;
//   const worker = new Worker('./src/test-script.ts', {
//     workerData: { target: possibleTargets[0] },
//   });

//   worker.once('message', (result) => {
//     console.log(result);
//   });

//   worker.on('error', (error) => {
//     console.log(error);
//   });

//   worker.on('exit', (exitCode) => {
//     console.log(`It exited with code ${exitCode}`);
//   });

//   console.log('Execution in main thread');
// };

main();
