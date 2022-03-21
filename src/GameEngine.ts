import { GameResponse } from './types';

export default abstract class GameEngine {
  abstract makeGuess(word: string): Promise<GameResponse>;
}
