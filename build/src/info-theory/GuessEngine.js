"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var words_json_1 = __importDefault(require("../../data/words.json"));
var utils_1 = require("../utils");
var progress = __importStar(require("cli-progress"));
var MAX_GUESSES = 6;
var GuessEngine = /** @class */ (function () {
    function GuessEngine(engine) {
        utils_1.sleep(3000);
        this.possibleGuesses = words_json_1.default;
        this.engine = engine;
        this.numGuesses = 0;
    }
    GuessEngine.minimax = function (isMaxTurn, state, alpha, beta, depth, maxDepth) {
        // console.log(depth);
        if (state.status === 'correct')
            return 1 / state.numGuesses;
        if (depth >= maxDepth) {
            return 0;
        }
        if (isMaxTurn) {
            var bestScore_1 = -Infinity;
            state.wordList.every(function (word) {
                var newState = __assign(__assign({}, state), { guess: word, numGuesses: state.numGuesses + 1, status: state.wordList.length === 0 && word === state.wordList[0]
                        ? 'correct'
                        : 'continue' });
                var value = GuessEngine.minimax(!isMaxTurn, newState, alpha, beta, depth + 1, maxDepth);
                bestScore_1 = Math.max(bestScore_1, value);
                alpha = Math.max(alpha, bestScore_1);
                if (beta <= alpha)
                    return false;
            });
            return bestScore_1;
        }
        else {
            var bestScore_2 = Infinity;
            state.wordList.forEach(function (word) {
                var feedback = utils_1.computeFeedback(state.guess, word);
                var remainingPossibleGuesses = GuessEngine.handleFeedback(state.guess, feedback, state.wordList);
                var newState = __assign(__assign({}, state), { status: remainingPossibleGuesses.length === 1 ? 'correct' : 'continue', wordList: remainingPossibleGuesses });
                var value = GuessEngine.minimax(!isMaxTurn, newState, alpha, beta, depth, maxDepth);
                bestScore_2 = Math.min(value, bestScore_2);
                beta = Math.min(beta, bestScore_2);
                if (beta <= alpha)
                    return false;
            });
            return bestScore_2;
        }
    };
    GuessEngine.handleAbsentFeedback = function (guess, feedback, possibleGuess, pos) {
        var letter = guess[pos];
        var containsOther = guess
            .split('')
            .some(function (it, i) { return i !== pos && it === letter && feedback[i] !== 'absent'; });
        if (!containsOther)
            return !possibleGuess.includes(letter);
        return possibleGuess[pos] !== guess[pos];
    };
    GuessEngine.handleFeedback = function (guess, feedback, wordList) {
        var remainingGuesses;
        guess.split('').forEach(function (letter, i) {
            wordList = wordList.filter(function (possibleGuess) {
                if (feedback[i] === 'correct')
                    return possibleGuess[i] === guess[i];
                if (feedback[i] === 'present')
                    return (possibleGuess.includes(guess[i]) && possibleGuess[i] !== guess[i]);
                return GuessEngine.handleAbsentFeedback(guess, feedback, possibleGuess, i);
            });
            remainingGuesses = wordList;
        });
        return remainingGuesses;
    };
    GuessEngine.prototype.computeInformationGain = function (guess, feedback) {
        var remainingGuesses = __spreadArrays(this.possibleGuesses);
        remainingGuesses = GuessEngine.handleFeedback(guess, feedback, remainingGuesses);
        return remainingGuesses.length === 0
            ? 0
            : -Math.log2(remainingGuesses.length / this.possibleGuesses.length);
    };
    GuessEngine.prototype.computeBestGuess = function () {
        if (this.possibleGuesses.length <= 20)
            return this.computeBestGuessWithMinimax();
        else
            return this.computeBestGuessWithInformationGain();
    };
    GuessEngine.prototype.computeBestGuessWithMinimax = function () {
        var _this = this;
        // console.log('minimax');
        var state = {
            numGuesses: 0,
            status: 'continue',
            wordList: __spreadArrays(this.possibleGuesses),
            guess: '',
            chosenTarget: '',
        };
        var bestScore = -Infinity;
        var bestWord = '';
        state.wordList.forEach(function (word) {
            var newState = __assign(__assign({}, state), { guess: word, numGuesses: state.numGuesses + 1, status: state.wordList.length === 0 && word === state.wordList[0]
                    ? 'correct'
                    : 'continue' });
            var score = GuessEngine.minimax(true, newState, -Infinity, Infinity, 0, MAX_GUESSES - _this.numGuesses);
            if (score > bestScore) {
                bestScore = score;
                bestWord = word;
            }
        });
        return bestWord;
    };
    GuessEngine.prototype.computeBestGuessWithInformationGain = function () {
        var _this = this;
        if (this.numGuesses === 0) {
            this.numGuesses++;
            utils_1.sleep(3000);
            return 'soare';
        }
        var bar = new progress.SingleBar({}, progress.Presets.legacy);
        bar.start(this.possibleGuesses.length, 0);
        var expectedInformationGains = this.possibleGuesses.map(function (guess, i) {
            var probabilities = utils_1.allPossibleFeedback.map(function (feedback) {
                var numMatches = 0;
                _this.possibleGuesses.forEach(function (word) {
                    if (utils_1.isMatch(word, guess, feedback))
                        numMatches++;
                });
                return {
                    probability: numMatches / _this.possibleGuesses.length,
                    feedback: feedback,
                };
            });
            var expectedInformationGain = 0;
            probabilities.forEach(function (val) {
                expectedInformationGain +=
                    val.probability * _this.computeInformationGain(guess, val.feedback);
            });
            bar.update(i + 1);
            return { expectedInformationGain: expectedInformationGain, guess: guess };
        });
        bar.stop();
        var sorted = expectedInformationGains.sort(function (v1, v2) { return v2.expectedInformationGain - v1.expectedInformationGain; });
        return sorted[0].guess;
    };
    GuessEngine.prototype.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, guess;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        response = null;
                        _a.label = 1;
                    case 1:
                        if (!(response === null || response.status === 'continue')) return [3 /*break*/, 3];
                        console.log('Determining the best guess...');
                        guess = this.computeBestGuess();
                        return [4 /*yield*/, this.engine.makeGuess(guess)];
                    case 2:
                        response = _a.sent();
                        this.possibleGuesses = GuessEngine.handleFeedback(guess, response.feedback, this.possibleGuesses);
                        console.log(response);
                        return [3 /*break*/, 1];
                    case 3: return [2 /*return*/, response];
                }
            });
        });
    };
    return GuessEngine;
}());
exports.default = GuessEngine;
