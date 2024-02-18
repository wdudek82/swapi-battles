export enum Resources {
  people = 'people',
  starships = 'starships',
}

export interface Person {
  mass: string;
}

export interface Starship {
  crew: string;
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

export interface SwApiResult {
  uid: string;
  name: string;
  url: string;
  properties?: { [key: string]: string };
  type?: Resources;
}

