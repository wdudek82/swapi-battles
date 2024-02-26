import { PreloadPage } from '../support/preload-page';

const preloadPage = new PreloadPage();

describe('SW-API Battles data preloading test', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('Handles network outage on data load', () => {
    cy.intercept('GET', 'https://swapi.tech/api/*', { statusCode: 500 }); // Simulate a server error

    preloadPage.clickPreloadButton();

    preloadPage.assertReloadInitialDataBtnIsVisibleAndEnabled();

    preloadPage.assertErrorToastIsVisible();
  });

  it('Stars preloading data on retry when network outage has been resolved', () => {
    cy.intercept('GET', 'https://swapi.tech/api/*', (req) => {
      const res = { statusCode: 500 };
      req.destroy();
      return res;
    });

    preloadPage.clickPreloadButton();

    preloadPage.assertReloadInitialDataBtnIsVisibleAndEnabled();

    preloadPage.interceptPeopleListReq(2000);
    preloadPage.interceptStarshipsListReq(2000);

    preloadPage.clickPreloadButton();

    preloadPage.preloadButton
      .should('contain.text', 'Loading game data...')
      .and('be.disabled');
  });

  it('Starts preloading data when load button clicked', () => {
    preloadPage.interceptPeopleListReq(2000);
    preloadPage.interceptStarshipsListReq(2000);

    preloadPage.clickPreloadButton();

    preloadPage.preloadButton
      .should('contain.text', 'Loading game data...')
      .should('have.class', 'mat-spinner')
      .and('be.disabled');

    // Assertion: Game logs container is not empty when data is loaded
    cy.get('[data-testid="preloading-logs-container"]').contains('p');
  });

  it('Switches to game board screen after preloading data', () => {
    preloadPage.interceptPeopleListReq();
    preloadPage.interceptStarshipsListReq();

    preloadPage.clickPreloadButton();

    // Assertion 1: When loading is finished preloading screen is replaced by the game board screen.
    cy.get('app-game-board').should('be.visible');
    cy.get('app-loading-screen').should('not.exist');
  });
});
