import { Component, Input } from '@angular/core';
import { concat } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ViewStatus } from '../../models/viewStatus';
import { BattleOutcome, UnitData, UnitType } from '../../models/swapi.models';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-game-board-component',
  templateUrl: './game-board-component.component.html',
  styleUrl: './game-board-component.component.scss',
})
export class GameBoardComponentComponent {
  protected readonly ViewStatus = ViewStatus;
  protected readonly UnitType = UnitType;

  playersViewStatus = ViewStatus.INITIAL;
  isLoadingResource: Record<UnitType, boolean> = {
    [UnitType.people]: false,
    [UnitType.starships]: false,
  };
  playersData: UnitData[] = [];
  scores: number[] = [0, 0];

  get isFightBtnDisabled(): boolean {
    return (
      this.playersData.length < 2 ||
      this.playersViewStatus === ViewStatus.INITIAL
    );
  }

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
  ) {}

  getRandomResourceOfTypeForPlayers(type: UnitType): void {
    this.isLoadingResource[type] = true;

    this.resetBattleOutcomeForPlayers();
    this.playersData = [];
    this.playersViewStatus = ViewStatus.LOADING;

    concat(
      this.dataService.getRandomResourceOfType(type),
      this.dataService.getRandomResourceOfType(type),
    ).subscribe({
      next: (data) => {
        if (data) {
          this.playersData.push(data);
        }
      },
      error: () => {
        this.playersViewStatus = ViewStatus.ERROR;
        this.showRandomItemWarning(type);
        this.isLoadingResource[type] = false;
      },
      complete: () => {
        this.playersViewStatus = ViewStatus.SUCCESS;
        this.isLoadingResource[type] = false;
      },
    });
  }

  private showRandomItemWarning(type: UnitType): void {
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
    if (this.playersData[0]?.additions?.type === UnitType.people) {
      valueA = calculateValue(playerA.properties?.mass);
      valueB = calculateValue(playerB.properties?.mass);
    }
    if (this.playersData[0]?.additions?.type === UnitType.starships) {
      valueA = calculateValue(playerA.properties?.crew);
      valueB = calculateValue(playerB.properties?.crew);
    }
    this.updateScores(+valueA, +valueB);
  }

  private updateScores(a: number, b: number): void {
    if (a > b) {
      this.scores[0] += 1;
      this.playersData[0].additions.battleOutcome = BattleOutcome.VICTORY;
      this.playersData[1].additions.battleOutcome = BattleOutcome.DEFEAT;
    } else if (a < b) {
      this.scores[1] += 1;
      this.playersData[0].additions.battleOutcome = BattleOutcome.DEFEAT;
      this.playersData[1].additions.battleOutcome = BattleOutcome.VICTORY;
    } else {
      this.playersData[0].additions.battleOutcome = BattleOutcome.TIE;
      this.playersData[1].additions.battleOutcome = BattleOutcome.TIE;
    }
  }

  private resetBattleOutcomeForPlayers() {
    for (const playerData of this.playersData) {
      if (playerData.additions) {
        playerData.additions.battleOutcome = BattleOutcome.NONE;
      }
    }
  }
}
