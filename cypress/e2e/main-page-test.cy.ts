describe("SW-API Battles Main Page Load Test", () => {
  it("Should verify core elements on initial page load", () => {
    cy.visit("/"); // Navigate to your application's URL

    // Assertion 1: Page Load Success (Optional)
    cy.url().should("include", "/swapi-battles/");  // Check if the URL path is correct
    cy.title().should("contain", "SW-API Battles"); // Or your expected page title

    // Assertion 2: Toolbar Element with Text
    cy.get("app-header > mat-toolbar > mat-toolbar-row span").should(
      "contain.text",
      "SW-API Battles"
    );

    // Assertion 3: "Load game data" button exists and is enabled
    cy.get("div.main-container app-loading-screen button")
      .should("exist")
      .and("not.be.disabled");

    // Assertion 4: Empty game logs div
    cy.get("div.main-container div.game-logs").should("be.empty");
  });
});
