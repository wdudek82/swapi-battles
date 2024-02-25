import Chainable = Cypress.Chainable;

export class PreloadPage {
  get preloadButton(): Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="preloading-game-data-bnt"]');
  }
  get errorToast(): Chainable<JQuery<HTMLElement>> {
    return cy.get('div.ngx-toastr.toast-error');
  }

  clickPreloadButton(): void {
    this.preloadButton.click();
  }

  interceptPeopleListReq(delay: number = 0): void {
    cy.intercept('GET', 'https://swapi.tech/api/people', {
      fixture: 'people-api-res.json',
      delay,
    });
  }

  interceptStarshipsListReq(delay: number = 0): void {
    cy.intercept('GET', 'https://swapi.tech/api/starships', {
      fixture: 'starships-api-res.json',
      delay,
    });
  }

  preloadInitialGameData(): void {
    this.interceptPeopleListReq();
    this.interceptStarshipsListReq();

    this.clickPreloadButton();
  }

  assertErrorToastIsVisible(): void {
    this.errorToast.should('be.visible');
    cy.get('div.ngx-toastr.toast-error div.toast-title').should(
      'contain.text',
      'Preloading failed',
    );
    cy.get('div.ngx-toastr.toast-error div.toast-message').should(
      'contain.text',
      'Something went wrong...',
    );
  }

  assertReloadInitialDataBtnIsVisibleAndEnabled(): void {
    this.preloadButton
      .should('contain.text', 'Reload game data')
      .and('not.be.disabled');
  }

  assertReloadInitialDataBtnIsVisibleAndDisabled(): void {
    cy.get('[data-testid="preloading-game-data-bnt"]')
      .should('contain.text', 'Reload game data')
      .and('be.disabled');
  }
}
