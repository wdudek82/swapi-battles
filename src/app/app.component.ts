import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './services/data.service';
import { ViewStatus } from './models/viewStatus';
import { BattleOutcome, Resources, SwApiResult } from './models/swapi.models';
import { catchError, concat, map, throwError } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly Resources = Resources;
  protected readonly ViewStatus = ViewStatus;

  viewStatus = ViewStatus.INITIAL;

  loadedData: SwApiResult[] = [];

  playersViewStatus = ViewStatus.INITIAL;
  playersData: SwApiResult[] = [];
  scores = [0, 0];

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
  ) {}

  onLoadInitialResources(): void {
    this.viewStatus = ViewStatus.LOADING;

    this.dataService.loadAllInitialResources().subscribe({
      next: (res) => {
        res.results.forEach((result) => {
          this.loadedData.unshift({
            ...result,
            additions: {
              ...result.additions,
              type: Resources.people ? Resources.people : Resources.starships,
            },
          });
        });
      },
      error: (_err) => {
        this.viewStatus = ViewStatus.ERROR;
        this.toastr.error('Something went wrong...', 'Preloading failed');
      },
      complete: () => {
        this.viewStatus = ViewStatus.SUCCESS;
      },
    });
  }

  getRandomResourceOfTypeForPlayers(type: Resources): void {
    this.resetBattleOutcomeForPlayers();
    this.playersData = [];
    this.playersViewStatus = ViewStatus.LOADING;

    concat(
      this.dataService.getRandomResourceOfType(type),
      this.dataService.getRandomResourceOfType(type),
    )
      .pipe(
        map((data) => {
          if (data) {
            this.playersData.push(data);
            this.playersViewStatus = ViewStatus.SUCCESS;
          }
          return data;
        }),
        catchError((err) => {
          this.playersViewStatus = ViewStatus.ERROR;
          this.showRandomItemWarning(type);
          return throwError(() => err);
        }),
      )
      .subscribe({
        complete: () => {
          console.log('players data loaded:', this.playersData);
        },
      });
  }

  private showRandomItemWarning(type: Resources): void {
    this.toastr.warning(
      `Please load initial ${type} data and try again`,
      `Warning`,
    );
  }

  calculateResult(): void {
    this.playersViewStatus = ViewStatus.INITIAL;
    const calculateValue = (value?: string): number => {
      if (!value || value === 'unknown') {
        return 0;
      }
      if (value.includes('-')) {
        value = value.split('-')[1];
      }
      return parseInt(value.replace(/,/g, ''), 10);
    };

    const [playerA, playerB] = this.playersData;
    let valueA = 0;
    let valueB = 0;
    if (this.playersData[0]?.additions?.type === Resources.people) {
      valueA = calculateValue(playerA.properties?.['mass']);
      valueB = calculateValue(playerB.properties?.['mass']);
    }
    if (this.playersData[0]?.additions?.type === Resources.starships) {
      valueA = calculateValue(playerA.properties?.['crew']);
      valueB = calculateValue(playerB.properties?.['crew']);
    }
    this.updateScores(+valueA, +valueB);

    console.log('result:', this.playersData);
  }

  private updateScores(a: number, b: number): void {
    if (a > b) {
      this.scores[0] += 1;
      this.playersData[0].additions.battleResult = BattleOutcome.WON;
      this.playersData[1].additions.battleResult = BattleOutcome.LOST;
    } else if (a < b) {
      this.scores[1] += 1;
      this.playersData[0].additions.battleResult = BattleOutcome.LOST;
      this.playersData[1].additions.battleResult = BattleOutcome.WON;
    } else {
      this.playersData[0].additions.battleResult = BattleOutcome.TIE;
      this.playersData[1].additions.battleResult = BattleOutcome.TIE;
    }
  }

  private resetBattleOutcomeForPlayers() {
    for (const playerData of this.playersData) {
      if (playerData.additions) {
        playerData.additions.battleResult = BattleOutcome.NONE;
      }
    }
  }
}
