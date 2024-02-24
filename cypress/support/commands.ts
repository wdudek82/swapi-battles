// ***********************************************
// This example namespace declaration will help
// with Intellisense and code completion in your
// IDE or Text Editor.
// ***********************************************
// declare namespace Cypress {
//   interface Chainable<Subject = any> {
//     customCommand(param: any): typeof customCommand;
//   }
// }

// function customCommand(param: any): void {
//   console.warn(param);
// }
//
// NOTE: You can use it like so:
// Cypress.Commands.add('customCommand', customCommand);
//
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

// Cypress.Commands.add('assertErrorToastIsVisible', (): void => {
//   cy.get('div.ngx-toastr.toast-error')
//     .should('be.visible')
//     .within(() => {
//       cy.get('div.ngx-toastr.toast-error div.toast-title').should(
//         'contain.text',
//         'Preloading failed',
//       );
//       cy.get('div.ngx-toastr.toast-error div.toast-message').should(
//         'contain.text',
//         'Something went wrong...',
//       );
//     });
// });
//
// Cypress.Commands.add(
//   'assertReloadInitialDataBtnIsVisibleAndEnabled',
//   () => {
//     cy.get('[data-testid="preloading-game-data-bnt"]')
//       .should('contain.text', 'Reload game data')
//       .and('not.be.disabled');
//   },
// );
//
// Cypress.Commands.add(
//   'assertReloadInitialDataBtnIsVisibleAndDisabled',
//   () => {
//     cy.get('[data-testid="preloading-game-data-bnt"]')
//       .should('contain.text', 'Reload game data')
//       .and('be.disabled');
//   },
// );
