describe('SW-API Battles Main Page Load Test', () => {
  it('Should verify core elements on initial page load', () => {
    cy.visit('/'); // Navigate to your application's URL

    // Assertion 1: Page Load Success (Optional)
    // cy.url().should("include", "/swapi-battles/");  // Check if the URL path is correct
    cy.title().should('contain', 'SW-API Battles'); // Or your expected page title

    // Assertion 2: Toolbar Element with Text
    cy.get('[data-testid="toolbar"]').should(
      'contain.text',
      'SW-API Battles',
    );

    // Assertion 3: "Load game data" button exists and is enabled
    cy.get( '[data-testid="preloading-game-data-bnt"]')
      .should( 'contain.text', 'Load game data')
      .and('not.be.disabled');

    // Assertion 4: Empty game logs div
    cy.get('[data-testid="preloading-logs-container"]').should('be.empty');
  });
});
