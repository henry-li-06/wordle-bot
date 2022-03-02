import GuessEngine from './GuessEngine';
import SimulationEngine from './SimulationEngine';

const engine = new GuessEngine(new SimulationEngine('hello'));
console.log(engine.computeBestGuess());
