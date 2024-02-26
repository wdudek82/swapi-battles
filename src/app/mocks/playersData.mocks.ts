import { BattleOutcome, UnitData, UnitType } from '../models/swapi.models';

export const playersDataListMocksForPeople: UnitData[] = [
  {
    uid: '1',
    name: 'Luck',
    url: 'https://api/people/1',
    additions: {
      battleOutcome: BattleOutcome.NONE,
      type: UnitType.people,
    },
    properties: {
      mass: '70',
    }
  },
  {
    uid: '2',
    name: 'Vader',
    url: 'https://api/people/2',
    additions: {
      battleOutcome: BattleOutcome.NONE,
      type: UnitType.people,
    },
    properties: {
      mass: '95',
    }
  },
];

export const playersDataListMocksForStarships: UnitData[] = [
  {
    uid: '3',
    name: 'Star Destroyer',
    url: 'https://api/starships/1',
    additions: {
      battleOutcome: BattleOutcome.NONE,
      type: UnitType.starships,
    },
    properties: {
      crew: '10000',
    }
  },
  {
    uid: '4',
    name: 'X-Wing',
    url: 'https://api/starships/2',
    additions: {
      battleOutcome: BattleOutcome.NONE,
      type: UnitType.starships,
    },
    properties: {
      crew: '2',
    }
  },
];
