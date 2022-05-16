// const { parentPort, workerData } = require('worker_threads');
// const SimulationEngine = require('./info-theory/SimulationEngine');
// const GuessEngine = require('./info-theory/GuessEngine');

import { parentPort, workerData } from 'worker_threads';
import SimulationEngine from './info-theory/SimulationEngine';
import GuessEngine from './info-theory/GuessEngine';

parentPort?.postMessage(guessTargetWord(workerData.target));

async function guessTargetWord(target) {
  const engine = new GuessEngine(new SimulationEngine(target));
  const response = await engine.start();
  return response.numGuesses;
}

const main = async () => {
  // const target = workerData.target;
  const target = 'hello';
  guessTargetWord(target).then((res) => parentPort?.postMessage(res));
};

main();
