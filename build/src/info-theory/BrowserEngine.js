"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var selenium_webdriver_1 = require("selenium-webdriver");
var GameEngine_1 = __importDefault(require("./GameEngine"));
var utils_1 = require("../utils");
var BrowserEngine = /** @class */ (function (_super) {
    __extends(BrowserEngine, _super);
    function BrowserEngine() {
        var _this = _super.call(this) || this;
        _this.driver = new selenium_webdriver_1.Builder().forBrowser('chrome').build();
        _this.driver.get('https://www.nytimes.com/games/wordle/index.html');
        utils_1.sleep(5000);
        _this.getShadowRoot(_this.driver, 'game-app').then(function (shadowRoot) {
            return _this.getShadowRoot(shadowRoot, 'game-modal').then(function (shadowRoot) {
                return shadowRoot
                    .findElement(selenium_webdriver_1.By.className('close-icon'))
                    .then(function (closeButton) { return closeButton.click(); });
            });
        });
        return _this;
    }
    BrowserEngine.prototype.getShadowRoot = function (shadowHost, element) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                return [2 /*return*/, shadowHost
                        .findElement(selenium_webdriver_1.By.css(element))
                        .then(function (shadowRoot) {
                        return _this.driver.executeScript('return arguments[0].shadowRoot', shadowRoot);
                    })];
            });
        });
    };
    BrowserEngine.prototype.getGameRoot = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.getShadowRoot(this.driver, 'game-app')];
            });
        });
    };
    BrowserEngine.prototype.getGameRow = function (rowShadowHost) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                return [2 /*return*/, this.driver.executeScript('return arguments[0].shadowRoot', rowShadowHost)];
            });
        });
    };
    BrowserEngine.prototype.readFeedback = function () {
        return __awaiter(this, void 0, void 0, function () {
            var gameRoot, row, shadowRoot;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGameRoot()];
                    case 1:
                        gameRoot = _a.sent();
                        return [4 /*yield*/, gameRoot.findElements(selenium_webdriver_1.By.css('game-row'))];
                    case 2:
                        row = (_a.sent())[this.numGuesses];
                        return [4 /*yield*/, this.driver.executeScript('return arguments[0].shadowRoot', row)];
                    case 3:
                        shadowRoot = _a.sent();
                        return [2 /*return*/, shadowRoot
                                .findElements(selenium_webdriver_1.By.css('game-tile'))
                                .then(function (tiles) {
                                return Promise.all(tiles.map(function (tile) {
                                    return _this.driver
                                        .executeScript('return arguments[0].shadowRoot', tile)
                                        .then(function (shadowRoot) {
                                        return shadowRoot
                                            .findElement(selenium_webdriver_1.By.className('tile'))
                                            .then(function (tile) { return tile.getAttribute('data-state'); });
                                    });
                                }));
                            })];
                }
            });
        });
    };
    BrowserEngine.prototype.inputGuess = function (guess) {
        return __awaiter(this, void 0, void 0, function () {
            var keyboard;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGameRoot()
                            .then(function (gameRoot) { return _this.getShadowRoot(gameRoot, 'game-keyboard'); })
                            .then(function (shadowRoot) { return shadowRoot.findElement(selenium_webdriver_1.By.id('keyboard')); })];
                    case 1:
                        keyboard = _a.sent();
                        keyboard.findElements(selenium_webdriver_1.By.css('button')).then(function (buttons) {
                            guess.split('').forEach(function (letter) {
                                buttons.forEach(function (button) {
                                    return button.getAttribute('data-key').then(function (key) {
                                        if (key === letter)
                                            button.click();
                                    });
                                });
                            });
                            keyboard
                                .findElement(selenium_webdriver_1.By.className('one-and-a-half'))
                                .then(function (button) { return button.click(); });
                        });
                        return [2 /*return*/];
                }
            });
        });
    };
    BrowserEngine.prototype.makeGuess = function (guess) {
        return __awaiter(this, void 0, void 0, function () {
            var gameRoot, feedback, status;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.getGameRoot()];
                    case 1:
                        gameRoot = _a.sent();
                        return [4 /*yield*/, this.inputGuess(guess)];
                    case 2:
                        _a.sent();
                        return [4 /*yield*/, utils_1.sleep(5000).then(function () { return _this.readFeedback(); })];
                    case 3:
                        feedback = _a.sent();
                        this.numGuesses++;
                        status = feedback.every(function (info) { return info === 'correct'; })
                            ? 'correct'
                            : this.numGuesses < 6
                                ? 'continue'
                                : 'finished';
                        return [2 /*return*/, {
                                status: status,
                                feedback: feedback,
                                numGuesses: this.numGuesses,
                                guess: guess,
                            }];
                }
            });
        });
    };
    return BrowserEngine;
}(GameEngine_1.default));
exports.default = BrowserEngine;
