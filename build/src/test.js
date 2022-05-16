"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var possible_words_json_1 = __importDefault(require("../data/possible-words.json"));
var worker_threads_1 = require("worker_threads");
// const average = (array) => array.reduce((a, b) => a + b) / array.length;
// const main = async () => {
//   const description = process.argv[2];
//   const size = process.argv[3];
//   const targetList = _.sampleSize(
//     possibleTargets,
//     size ? Number(size) : possibleTargets.length
//   );
//   const results = await Promise.all(
//     targetList.map(async (target) => {
//       const engine = new GuessEngine(new SimulationEngine(target));
//       const response = await engine.start();
//       return response.numGuesses;
//     })
//   );
//   console.log(`------ Average: ${average(results)} ------`);
//   const outputString = `Description: ${description}\n${average(results)}\n\n`;
//   fs.appendFile('./logs/log.txt', outputString, (err) => {
//     if (err) console.log(err);
//     console.log(__dirname);
//   });
// };
var main = function () {
    var number = 10;
    var worker = new worker_threads_1.Worker('./src/test-script.js', {
        workerData: { target: possible_words_json_1.default[0] },
    });
    worker.once('message', function (result) {
        console.log(result);
    });
    worker.on('error', function (error) {
        console.log(error);
    });
    worker.on('exit', function (exitCode) {
        console.log("It exited with code " + exitCode);
    });
    console.log('Execution in main thread');
};
main();
