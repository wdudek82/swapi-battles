export interface ApiPageResponse {
  total_records: number;
  previous: string | null;
  next: string | null;
  results: UnitData[];
  message: string;
}

export interface ApiItemResponse {
  result: {
    properties: { [key: string]: string };
  };
  message: string;
}

export enum BattleOutcome {
  VICTORY = 'victory',
  DEFEAT = 'defeat',
  TIE = 'tie',
  NONE = 'none',
}

export enum UnitType {
  people = 'people',
  starships = 'starships',
}

export interface UnitData {
  uid: string;
  name: string;
  url: string;
  properties?: { mass?: string; crew?: string };
  additions: {
    type: UnitType;
    battleOutcome: BattleOutcome;
  };
}
