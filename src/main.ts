// import GuessEngine from './info-theory/GuessEngine';
// import BrowserEngine from './info-theory/BrowserEngine';

// const engine = new GuessEngine(new BrowserEngine());
// engine.start();
import wordList from '../data/possible-words.json';
import { findBestWord } from './absurdle/minimax';
import { GameState } from './absurdle/types';

const words = wordList.slice(0, 100);

const state: GameState = {
  numGuesses: 0,
  status: 'continue',
  wordList: words,
  guess: '',
  chosenTarget: '',
};

console.log(findBestWord(state));
