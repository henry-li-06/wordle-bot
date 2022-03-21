import { Builder, WebDriver, By } from 'selenium-webdriver';
import GameEngine from './GameEngine';
import { GameResponse, LetterInfo } from './types';
import { convertFeedback } from './utils';

const sleep = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

export default class BrowserEngine extends GameEngine {
  driver: WebDriver;
  numGuesses: number;

  constructor() {
    super();
    this.numGuesses = 0;
    this.driver = new Builder().forBrowser('chrome').build();
    this.driver.get('https://www.nytimes.com/games/wordle/index.html');
    setTimeout(
      () =>
        this.getShadowRoot(this.driver, 'game-app').then((shadowRoot) =>
          this.getShadowRoot(shadowRoot, 'game-modal').then((shadowRoot) =>
            shadowRoot
              .findElement(By.className('close-icon'))
              .then((closeButton) => closeButton.click())
          )
        ),
      5000
    );
  }

  private async getShadowRoot(shadowHost: any, element: string) {
    return shadowHost
      .findElement(By.css(element))
      .then((shadowRoot) =>
        this.driver.executeScript('return arguments[0].shadowRoot', shadowRoot)
      );
  }

  private async getGameRoot(): Promise<any> {
    return this.getShadowRoot(this.driver, 'game-app');
  }

  private async getGameRow(rowShadowHost: any) {
    return this.driver.executeScript(
      'return arguments[0].shadowRoot',
      rowShadowHost
    );
  }

  private async readFeedback(): Promise<LetterInfo[]> {
    const gameRoot = await this.getGameRoot();
    const row = (await gameRoot.findElements(By.css('game-row')))[
      this.numGuesses
    ];
    const shadowRoot: any = await this.driver.executeScript(
      'return arguments[0].shadowRoot',
      row
    );

    return shadowRoot
      .findElements(By.css('game-tile'))
      .then((tiles) =>
        Promise.all(
          tiles.map((tile) =>
            this.driver
              .executeScript('return arguments[0].shadowRoot', tile)
              .then((shadowRoot: any) =>
                shadowRoot
                  .findElement(By.className('tile'))
                  .then((tile) => tile.getAttribute('data-state'))
              )
          )
        )
      );
  }

  private async inputGuess(guess: string) {
    const keyboard = await this.getGameRoot()
      .then((gameRoot) => this.getShadowRoot(gameRoot, 'game-keyboard'))
      .then((shadowRoot) => shadowRoot.findElement(By.id('keyboard')));
    keyboard.findElements(By.css('button')).then((buttons) => {
      guess.split('').forEach((letter) => {
        buttons.forEach((button) =>
          button.getAttribute('data-key').then((key) => {
            if (key === letter) button.click();
          })
        );
      });
      keyboard
        .findElement(By.className('one-and-a-half'))
        .then((button) => button.click());
    });
  }

  async makeGuess(guess: string): Promise<GameResponse> {
    const gameRoot = await this.getGameRoot();
    await this.inputGuess(guess);
    await sleep(3000);
    const feedback = await this.readFeedback();
    console.log(feedback);

    this.numGuesses++;
    const status = feedback.every((info) => info === 'green')
      ? 'correct'
      : this.numGuesses < 6
      ? 'continue'
      : 'finished';
    return {
      status,
      feedback: convertFeedback(feedback),
      numGuesses: this.numGuesses,
      guess,
    };
  }
}
