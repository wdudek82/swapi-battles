import { defineConfig } from "cypress";

// TODO: Cypress causes conflics with Karma/Jasmine.
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
