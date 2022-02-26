import SimulationEngine from './SimulationEngine';
import GuessEngine from './GuessEngine';

const engine = new GuessEngine(new SimulationEngine('below'));
engine.start();
