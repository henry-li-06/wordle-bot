import GameEngine from '../info-theory/GameEngine';
import { GameResponse, GameStatus } from '../types';
import possibleWords from '../../data/possible-words.json';

class GameState {
  numGuesses: number;
  status: GameStatus;
  wordList: string[];

  constructor() {
    this.numGuesses = 0;
    this.status = 'continue';
  }
}

export default GameState;
