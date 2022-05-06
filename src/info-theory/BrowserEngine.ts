import { Builder, WebDriver, By } from 'selenium-webdriver';
import GameEngine from './GameEngine';
import { GameResponse, LetterInfo } from '../types';
import { sleep } from '../utils';

export default class BrowserEngine extends GameEngine {
  driver: WebDriver;

  constructor() {
    super();
    this.driver = new Builder().forBrowser('chrome').build();
    this.driver.get('https://www.nytimes.com/games/wordle/index.html');
    sleep(5000);
    this.getShadowRoot(this.driver, 'game-app').then((shadowRoot) =>
      this.getShadowRoot(shadowRoot, 'game-modal').then((shadowRoot) =>
        shadowRoot
          .findElement(By.className('close-icon'))
          .then((closeButton) => closeButton.click())
      )
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
    const feedback = await sleep(5000).then(() => this.readFeedback());

    this.numGuesses++;
    const status = feedback.every((info) => info === 'correct')
      ? 'correct'
      : this.numGuesses < 6
      ? 'continue'
      : 'finished';
    return {
      status,
      feedback,
      numGuesses: this.numGuesses,
      guess,
    };
  }
}
