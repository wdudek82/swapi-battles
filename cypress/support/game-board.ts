import Chainable = Cypress.Chainable;
import { BattleOutcome, UnitType } from '../../src/app/models/swapi.models';

enum ComparedAttr {
  MASS = 'Mass',
  CREW = 'Crew',
  UNKNOWN = 'unknown',
}

export enum BattleOutcomeLabel {
  WON = 'Won',
  LOST = 'Lost',
  TIE = 'TIE',
}

export const playersMocks = {
  people: ['person-api-res-1.json', 'person-api-res-2.json'],
  starships: ['starship-api-res-1.json', 'starship-api-res-2.json'],
};

export class GameBoard {
  get peopleCardsButton(): Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="prepare-people-btn"]');
  }

  get starshipsCardsButton(): Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="prepare-starships-btn"]');
  }

  get startBattleButton(): Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="start-battle-btn"]');
  }

  get playerCardOne(): Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="player-card-0"]');
  }

  get playerCardTwo(): Chainable<JQuery<HTMLElement>> {
    return cy.get('[data-testid="player-card-1"]');
  }

  clickPeopleCardsBtn(): void {
    this.peopleCardsButton.click();
  }

  clickStarshipsCardsBtn(): void {
    this.starshipsCardsButton.click();
  }

  clickStartBattleBtn(): void {
    this.startBattleButton.click();
  }

  interceptPlayerCardsRequests(
    type: UnitType,
    mockOne: string,
    mockTwo: string,
  ): void {
    let requestCount = 0;
    cy.intercept('GET', `https://swapi.tech/api/${type}/*`, (req) => {
      requestCount += 1;
      if (requestCount === 1) {
        req.reply({ fixture: mockOne });
      } else if (requestCount === 2) {
        req.reply({ fixture: mockTwo });
      } else {
        req.continue();
      }
    });
  }

  assertGameControlsInInitialState(): void {
    cy.get('[data-testid="prepare-people-btn"]')
      .should('be.visible')
      .and('be.enabled');
    cy.get('[data-testid="prepare-starships-btn"]')
      .should('be.visible')
      .and('be.enabled');
    cy.get('[data-testid="start-battle-btn"]')
      .should('be.visible')
      .and('be.disabled');
  }

  assertGameControlsInLoadingState(): void {
    cy.get('[data-testid="prepare-people-btn"]')
      .should('be.visible')
      .and('be.disabled');
    cy.get('[data-testid="prepare-starships-btn"]')
      .should('be.visible')
      .and('be.disabled');
    cy.get('[data-testid="start-battle-btn"]')
      .should('be.visible')
      .and('be.disabled');
  }

  assertGameControlsInReadyState(): void {
    cy.get('[data-testid="prepare-people-btn"]')
      .should('be.visible')
      .and('be.enabled');
    cy.get('[data-testid="prepare-starships-btn"]')
      .should('be.visible')
      .and('be.enabled');
    cy.get('[data-testid="start-battle-btn"]')
      .should('be.visible')
      .and('be.enabled');
  }

  assertThatCardsForTypeLoaded(type: UnitType): void {
    let comparedAttr: ComparedAttr = ComparedAttr.UNKNOWN;
    if (type === UnitType.people) {
      comparedAttr = ComparedAttr.MASS;
    } else if (type === UnitType.starships) {
      comparedAttr = ComparedAttr.CREW;
    }

    this.playerCardOne
      .find('[data-testid="player-compared-attribute"]')
      .should('contain.text', `${comparedAttr}:`);
    this.playerCardTwo
      .find('[data-testid="player-compared-attribute"]')
      .should('contain.text', `${comparedAttr}:`);
  }

  assertNumberOfPlayerCardsLoaded(value: number): void {
    cy.get('[data-testid="players-cards__container"]', { timeout: 5000 })
      .children()
      .should('have.length', value);
  }

  assertPlayerCardState(
    playerCard: Chainable<JQuery<HTMLElement>>,
    label: BattleOutcomeLabel,
    outcomeClass: BattleOutcome,
  ): void {
    playerCard.find('mat-card').should('have.class', outcomeClass);
    playerCard
      .find('[data-testid="battle-outcome"]')
      .should('contain.text', label);
  }

  assertPlayerCardScore(
    playerCard: Chainable<JQuery<HTMLElement>>,
    value: number,
  ): void {
    playerCard
      .find('[data-testid="player-score"]')
      .should('contain.text', `Score: ${value}`);
  }

  assertInitialPlayersScore(): void {
    this.assertPlayerCardScore(this.playerCardOne, 0);
    this.assertPlayerCardScore(this.playerCardTwo, 0);
  }
}
