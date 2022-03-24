import SimulationEngine from './SimulationEngine';
import GuessEngine from './GuessEngine';
import BrowserEngine from './BrowserEngine';

const engine = new GuessEngine(new BrowserEngine());
engine.start();
