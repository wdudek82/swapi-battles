export enum Resources {
  people = 'people',
  starships = 'starships',
}

export interface SwApiRes {
  message: string;
}

export interface SwApiItemsListRes extends SwApiRes {
  total_records: number;
  previous: string | null;
  next: string | null;
  results: SwApiResult[];
}

export interface SwApiItemRes extends SwApiRes {
  result: {
    properties: { [key: string]: string };
  };
}

export enum BattleOutcome {
  WON = 'won',
  LOST = 'lost',
  TIE = 'tie',
  NONE = 'none',
}

export interface SwApiResult {
  uid: string;
  name: string;
  url: string;
  properties?: { [key: string]: string };
  additions: {
    type: Resources;
    battleResult: BattleOutcome;
  }
}

