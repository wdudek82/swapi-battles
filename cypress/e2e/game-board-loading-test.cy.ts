import { PreloadPage } from '../support/preload-page';
import {
  BattleOutcomeLabel,
  GameBoard,
  playersMocks,
} from '../support/game-board';
import { BattleOutcome, UnitType } from '../../src/app/models/swapi.models';

const preloadPage = new PreloadPage();
const gameBoard = new GameBoard();

describe('Game board page test', () => {
  beforeEach(() => {
    cy.visit('/');
    preloadPage.preloadInitialGameData();
  });

  it('Loads game board page after successful initial data preload', () => {
    // Assertion 1: When loading is finished preloading screen is replaced by the game board screen.
    cy.get('app-game-board-component').should('be.visible');
    cy.get('app-loading-screen').should('not.exist');

    // Assertion 2: All game board elements are visible
    cy.get('[data-testid="game-board-header"]').should(
      'contain.text',
      'Select units type and start the battle!',
    );

    // Assertion 3: Game controls loaded and in initial state
    gameBoard.assertGameControlsInInitialState();

    // Assertion 4: No players cards loaded yet
    cy.get('[data-testid="players-cards__container"]').should('be.empty');
  });

  it('Loads two people player cards', () => {
    gameBoard.clickPeopleCardsBtn();

    gameBoard.assertGameControlsInLoadingState();

    // Assert that spinner is visible only in people button.
    gameBoard.peopleCardsButton
      .should('contain.text', 'Preparing people...')
      .should('have.class', 'mat-spinner');
    gameBoard.starshipsCardsButton.should('not.have.class', 'mat-spinner');
    gameBoard.startBattleButton.should('not.have.class', 'mat-spinner');

    gameBoard.interceptPlayerCardsRequests(UnitType.people, playersMocks.people[0], playersMocks.people[1]);

    // Assert that two people cards have been loaded.
    gameBoard.assertNumberOfPlayerCardsLoaded(2);
    gameBoard.assertThatCardsForTypeLoaded(UnitType.people);

    // Assert that the game controls are re-enabled
    gameBoard.assertGameControlsInReadyState();
  });

  it('Correctly updates game state after fight when people selected', () => {
    gameBoard.interceptPlayerCardsRequests(UnitType.people, playersMocks.people[0], playersMocks.people[1]);

    gameBoard.clickPeopleCardsBtn();

    gameBoard.clickStartBattleBtn();

    // Assert that cards state has been correctly updated: bg color, score, result label.
    gameBoard.assertPlayerCardState(gameBoard.playerCardOne, BattleOutcomeLabel.WON, BattleOutcome.VICTORY);
    gameBoard.assertPlayerCardState(gameBoard.playerCardTwo, BattleOutcomeLabel.LOST, BattleOutcome.DEFEAT);

    gameBoard.assertPlayerCardScore(gameBoard.playerCardOne, 1);
    gameBoard.assertPlayerCardScore(gameBoard.playerCardTwo, 0);
  });

  it('Loads two starships players cards', () => {
    gameBoard.clickStarshipsCardsBtn();

    gameBoard.assertGameControlsInLoadingState();

    // Assert that spinner is visible only in people button.
    gameBoard.starshipsCardsButton
      .should('contain.text', 'Preparing starships...')
      .should('have.class', 'mat-spinner');
    gameBoard.peopleCardsButton.should('not.have.class', 'mat-spinner');
    gameBoard.startBattleButton.should('not.have.class', 'mat-spinner');

    gameBoard.interceptPlayerCardsRequests(UnitType.starships, playersMocks.starships[0], playersMocks.starships[1]);

    // Assert that two starships cards have been correctly loaded.
    gameBoard.assertNumberOfPlayerCardsLoaded(2);
    gameBoard.assertThatCardsForTypeLoaded(UnitType.starships);

    // Assert that the game controls are re-enabled
    gameBoard.assertGameControlsInReadyState();
  });

  it('Correctly updates game state after fight when starships selected', () => {
    gameBoard.interceptPlayerCardsRequests(UnitType.starships, playersMocks.starships[0], playersMocks.starships[1]);

    gameBoard.clickStarshipsCardsBtn();

    gameBoard.assertInitialPlayersScore();

    gameBoard.clickStartBattleBtn();

    // Assert that cards state has been correctly updated: bg color, score, result label.
    gameBoard.assertPlayerCardState(gameBoard.playerCardOne, BattleOutcomeLabel.WON, BattleOutcome.VICTORY);
    gameBoard.assertPlayerCardState(gameBoard.playerCardTwo, BattleOutcomeLabel.LOST, BattleOutcome.DEFEAT);

    gameBoard.assertPlayerCardScore(gameBoard.playerCardOne, 1);
    gameBoard.assertPlayerCardScore(gameBoard.playerCardTwo, 0);
  });

  it('Correctly reloads players cards when', () => {
    gameBoard.clickPeopleCardsBtn();
    // Assert that two people cards have been correctly loaded.
    gameBoard.assertNumberOfPlayerCardsLoaded(2);
    gameBoard.assertThatCardsForTypeLoaded(UnitType.people);

    gameBoard.clickStarshipsCardsBtn();
    // Assert that now starships cards have been correctly loaded.
    gameBoard.assertNumberOfPlayerCardsLoaded(2);
    gameBoard.assertThatCardsForTypeLoaded(UnitType.starships);
  });
});
