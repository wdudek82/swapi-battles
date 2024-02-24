import { PreloadPage } from '../support/preload-page';
const preloadPage = new PreloadPage();

describe('Game board page test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Loads game board page after successful initial data preload', () => {
    preloadPage.interceptPeopleListReq();
    preloadPage.interceptStarshipsListReq();

    cy.get('[data-testid="preloading-game-data-bnt"]').click();


    // Assertion 1: When loading is finished preloading screen is replaced by the game board screen.
    cy.get('app-game-board-component').should('be.visible');
    cy.get('app-loading-screen').should('not.exist');

    // Assertion 2: All game board elements are visible
    cy.get('[data-testid="game-board-header"]').should(
      'contain.text',
      'Select units type and start the battle!',
    );
    cy.get('[data-testid="prepare-people-btn"]')
      .should('be.visible')
      .and('be.enabled');
    cy.get('[data-testid="prepare-starships-btn"]')
      .should('be.visible')
      .and('be.enabled');
    cy.get('[data-testid="start-battle-btn"]')
      .should('be.visible')
      .and('be.disabled');
    cy.get('[data-testid="players-cards__container"]').should('be.empty');
  });

  xit('Loads two people player cards', () => {});
  xit('Correctly updates game state after fight when people selected', () => {});

  xit('Loads two starships players cards', () => {});
  xit('Correctly updates game state after fight when starships selected', () => {});

  xit('Correctly reloads players cards', () => {
    // prepare people cards
    // confirm that people cards are selected
    // then prepare starships cards
    // confirm that starships cards are selected
  });
});
