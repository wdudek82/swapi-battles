describe('SW-API Battles Load Test', () => {
  it('Should handle network outage on data load', () => {
    cy.visit('/');

    cy.intercept('GET', 'https://swapi.tech/api/*', { statusCode: 500 }); // Simulate a server error

    cy.get('div.main-container app-loading-screen button').click();

    cy.get('div.main-container app-loading-screen button')
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
