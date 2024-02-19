import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  catchError,
  concat,
  EMPTY,
  expand,
  map,
  Observable,
  of,
  throwError,
} from 'rxjs';
import {
  BattleOutcome,
  UnitType,
  ApiItemResponse,
  ApiPageResponse,
  PlayerData,
} from '../models/swapi.models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseApiUrl = 'https://swapi.tech/api';
  resources: { [key: string]: PlayerData[] } = {
    people: [],
    starships: [],
  };

  constructor(private http: HttpClient) {}

  loadAllInitialResources(): Observable<ApiPageResponse> {
    return concat(
      this.loadInitialResourcesOfType(UnitType.people),
      this.loadInitialResourcesOfType(UnitType.starships),
    );
  }

  private loadInitialResourcesOfType(
    type: UnitType,
  ): Observable<ApiPageResponse> {
    const initialUrl = `${this.baseApiUrl}/${type}`;
    return this.fetchResourcePage(initialUrl).pipe(
      expand(({ next, results }) => {
        this.resources[UnitType[type]].push(...results);
        return next ? this.fetchResourcePage(next) : EMPTY;
      }),
    );
  }

  getRandomResourceOfType(type: UnitType): Observable<PlayerData> {
    const randomIndex = this.getRandomIndex(type);

    if (randomIndex === -1) {
      // TODO: Exception handling?
      return throwError(() => new Error('no initial data'));
    }

    let resource = this.resources[UnitType[type]][randomIndex];

    if (Object.hasOwn(resource, 'properties')) {
      console.log(
        `Resource of type ${type}, UID ${resource.uid} retrieved from cache`,
      );
      return of(resource);
    } else {
      console.log(`Fetching resource of type ${type}, uid: ${resource.uid}...`);
      return this.fetchResourceOfTypeByUid(type, resource.uid).pipe(
        map((res) => {
          resource = {
            ...resource,
            properties: res.result.properties,
            additions: { type, battleOutcome: BattleOutcome.NONE },
          };
          this.resources[UnitType[type]][randomIndex] = resource;
          return resource;
        }),
        catchError((err) => {
          // TODO: Error handling
          return throwError(() => err);
        }),
      );
    }
  }

  private fetchResourcePage(url: string): Observable<ApiPageResponse> {
    return this.http.get<ApiPageResponse>(url);
  }

  private fetchResourceOfTypeByUid(
    type: UnitType,
    uid: string,
  ): Observable<ApiItemResponse> {
    // TODO:
    //  1. check if item data is cached - use cache or proceed with making request
    //  2. return item data

    return this.http
      .get<ApiItemResponse>(`${this.baseApiUrl}/${UnitType[type]}/${uid}`)
      .pipe(
        catchError((err) => {
          // show error modal or toast
          return throwError(() => err);
        }),
      );
  }

  private getRandomIndex(type: UnitType): number {
    const resourcesLength = this.resources[UnitType[type]].length;

    if (!resourcesLength) return -1;

    return Math.floor(Math.random() * resourcesLength);
  }
}
