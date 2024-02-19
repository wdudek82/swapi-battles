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
  Subject,
  throwError,
} from 'rxjs';
import {
  BattleOutcome,
  UnitType,
  ApiItemResponse,
  ApiPageResponse,
  UnitData,
} from '../models/swapi.models';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  baseApiUrl = environment.swApiBaseUrl;
  unitsData: { [key: string]: UnitData[] } = {
    people: [],
    starships: [],
  };
  private _loadedGameDataSub$: Subject<UnitData[]> = new Subject();
  loadedGameData$ = this._loadedGameDataSub$.asObservable();

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
        this.unitsData[UnitType[type]].push(...results);
        this._loadedGameDataSub$.next(results);
        return next ? this.fetchResourcePage(next) : EMPTY;
      }),
    );
  }

  getRandomResourceOfType(type: UnitType): Observable<UnitData> {
    const randomIndex = this.getRandomIndex(type);

    if (randomIndex === -1) {
      return throwError(() => new Error('no initial data'));
    }

    let resource = this.unitsData[UnitType[type]][randomIndex];

    if (Object.hasOwn(resource, 'properties')) {
      return of(resource);
    } else {
      return this.fetchResourceOfTypeByUid(type, resource.uid).pipe(
        map((res) => {
          resource = {
            ...resource,
            properties: res.result.properties,
            additions: { type, battleOutcome: BattleOutcome.NONE },
          };
          this.unitsData[UnitType[type]][randomIndex] = resource;
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
    const resourcesLength = this.unitsData[UnitType[type]].length;

    if (!resourcesLength) return -1;

    return Math.floor(Math.random() * resourcesLength);
  }
}
