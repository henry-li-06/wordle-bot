"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.computeFeedback = exports.sleep = exports.isMatch = exports.allPossibleFeedback = exports.getRandomArbitrary = exports.isValidWord = void 0;
var isValidWord = function (word) {
    return word.length === 5 && word.split('').every(function (letter) { return isLetter(letter); });
};
exports.isValidWord = isValidWord;
var isLetter = function (str) {
    return str.length === 1 && str.toLowerCase() !== str.toUpperCase();
};
var getRandomArbitrary = function (min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
};
exports.getRandomArbitrary = getRandomArbitrary;
var computeAllPossibleFeedback = function (len) {
    if (len === 1)
        return [['correct'], ['present'], ['absent']];
    var possiblities = ['correct', 'present', 'absent'];
    var result = [];
    possiblities.forEach(function (color) {
        var possibleFeedbacks = computeAllPossibleFeedback(len - 1);
        possibleFeedbacks.forEach(function (feedback) {
            var infoList = __spreadArrays([color], feedback);
            result.push(infoList);
        });
    });
    return result;
};
exports.allPossibleFeedback = computeAllPossibleFeedback(5);
var isMatch = function (word, guess, feedback) {
    return guess.split('').every(function (letter, i) {
        switch (feedback[i]) {
            case 'correct':
                return letter === word[i];
            case 'present':
                return word.includes(letter);
            case 'absent':
                return !word.includes(letter);
        }
    });
};
exports.isMatch = isMatch;
var sleep = function (delay) {
    return new Promise(function (resolve) { return setTimeout(resolve, delay); });
};
exports.sleep = sleep;
var computeFeedback = function (word, target) {
    var feedback = [];
    word.split('').forEach(function (letter, i) {
        if (letter === target[i])
            feedback.push('correct');
        else if (target.includes(letter))
            feedback.push('present');
        else
            feedback.push('absent');
    });
    return feedback;
};
exports.computeFeedback = computeFeedback;
