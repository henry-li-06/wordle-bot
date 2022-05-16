"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var GuessEngine_1 = __importDefault(require("./info-theory/GuessEngine"));
var BrowserEngine_1 = __importDefault(require("./info-theory/BrowserEngine"));
var engine = new GuessEngine_1.default(new BrowserEngine_1.default());
engine.start();
// import wordList from '../data/possible-words.json';
// import { findBestWord } from './absurdle/minimax';
// import { GameState } from './absurdle/types';
// const words = wordList.slice(0, 200);
// const state: GameState = {
//   numGuesses: 0,
//   status: 'continue',
//   wordList: words,
//   guess: '',
//   chosenTarget: '',
// };
// console.log(findBestWord(state));
