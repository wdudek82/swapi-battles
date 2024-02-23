import { defineConfig } from "cypress";

// TODO: Cypress causes conflics with Karma/Jasmine.
export default defineConfig({
  e2e: {
    baseUrl: "https://wdudek82.github.io/swapi-battles/",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
