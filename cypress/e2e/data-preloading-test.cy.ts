describe('SW-API Battles data preloading test', () => {
  it('Should preload data when load button clicked', () => {
    cy.visit('/');

    cy.get('[data-testid="preloading-game-data-bnt"]').click();

    cy.get('[data-testid="preloading-game-data-bnt"]')
      .should('contain.text', 'Loading game data...')
      .should('have.class', 'mat-spinner')
      .and('be.disabled');

    // Assertion 4: Game logs container is not empty when data is loaded
    cy.get('[data-testid="preloading-logs-container"]', {
      timeout: 13000,
    }).contains('p[data-testid="data-preloading-log"]');
  });

  it('Should handle network outage on data load', () => {
    cy.visit('/');

    cy.intercept('GET', 'https://swapi.tech/api/*', { statusCode: 500 }); // Simulate a server error

    cy.get('[data-testid="preloading-game-data-bnt"]').click();

    cy.get('[data-testid="preloading-game-data-bnt"]')
      .should('contain.text', 'Reload game data')
      .and('not.be.disabled');

    // Assertions for the error toast
    cy.get('div.ngx-toastr.toast-error').should('be.visible');

    cy.get('div.ngx-toastr.toast-error div.toast-title').should(
      'contain.text',
      'Preloading failed',
    );
    cy.get('div.ngx-toastr.toast-error div.toast-message').should(
      'contain.text',
      'Something went wrong...',
    );
  });
});
