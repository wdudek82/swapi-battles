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
  Resources,
  SwApiItemRes,
  SwApiItemsListRes,
  SwApiResult,
} from '../models/swapi.models';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseApiUrl = 'https://swapi.tech/api';
  resources: { [key: string]: SwApiResult[] } = {
    people: [],
    starships: [],
  };

  constructor(private http: HttpClient) {}

  loadAllInitialResources(): Observable<SwApiItemsListRes> {
    return concat(
      this.loadInitialResourcesOfType(Resources.people),
      this.loadInitialResourcesOfType(Resources.starships),
    );
  }

  private loadInitialResourcesOfType(
    type: Resources,
  ): Observable<SwApiItemsListRes> {
    const initialUrl = `${this.baseApiUrl}/${type}`;
    return this.fetchResourcePage(initialUrl).pipe(
      expand(({ next, results }) => {
        this.resources[Resources[type]].push(...results);
        return next ? this.fetchResourcePage(next) : EMPTY;
      }),
    );
  }

  getRandomResourceOfType(type: Resources): Observable<SwApiResult> {
    const randomIndex = this.getRandomIndex(type);

    if (randomIndex === -1) {
      // TODO: Exception handling?
      return throwError(() => new Error('no initial data'));
    }

    let resource = this.resources[Resources[type]][randomIndex];

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
            additions: { type, battleResult: BattleOutcome.NONE },
          };
          this.resources[Resources[type]][randomIndex] = resource;
          return resource;
        }),
        catchError((err) => {
          // TODO: Error handling
          return throwError(() => err);
        }),
      );
    }
  }

  private fetchResourcePage(url: string): Observable<SwApiItemsListRes> {
    return this.http.get<SwApiItemsListRes>(url);
  }

  private fetchResourceOfTypeByUid(
    type: Resources,
    uid: string,
  ): Observable<SwApiItemRes> {
    // TODO:
    //  1. check if item data is cached - use cache or proceed with making request
    //  2. return item data

    return this.http
      .get<SwApiItemRes>(`${this.baseApiUrl}/${Resources[type]}/${uid}`)
      .pipe(
        catchError((err) => {
          // show error modal or toast
          return throwError(() => err);
        }),
      );
  }

  private getRandomIndex(type: Resources): number {
    const resourcesLength = this.resources[Resources[type]].length;

    if (!resourcesLength) return -1;

    return Math.floor(Math.random() * resourcesLength);
  }
}
