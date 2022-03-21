import { Builder, By } from 'selenium-webdriver';
import BrowserEngine from './BrowserEngine';

const engine = new BrowserEngine();
setTimeout(() => engine.makeGuess('hello'), 5000);

// const main = async () => {
//   const driver = await new Builder().forBrowser('chrome').build();
//   try {
//     await driver.get('https://www.nytimes.com/games/wordle/index.html');
//     setTimeout(async () => {
//       const root: any = await driver
//         .findElement(By.css('game-app'))
//         .then((shadowHost) =>
//           driver.executeScript('return arguments[0].shadowRoot', shadowHost)
//         )
//         .then((shadowHost: any) =>
//           shadowHost
//             .findElement(By.css('game-modal'))
//             .then((shadowHost) =>
//               driver.executeScript('return arguments[0].shadowRoot', shadowHost)
//             )
//         );
//       console.log(root);
//       const closeButton = await root.findElement(By.className('close-icon'));

//       closeButton.click();
//     }, 5000);
//   } catch (e) {
//     console.log(e);
//   }
// };

// main();
