import SimulationEngine from './SimulationEngine';
import { GameResponse } from './types';
const engine = new SimulationEngine('spill');

const guesses = ['bears', 'slipt', 'spill'];
let response: GameResponse | null = null;
let i = 0;
while (response === null || response.status === 'continue') {
  response = engine.makeGuess(guesses[i]);
  console.log(response);
  i++;
}
