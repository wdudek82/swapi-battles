import { Component, Input } from '@angular/core';
import { ViewStatus } from '../../../models/viewStatus';
import { BattleOutcome, SwApiResult } from '../../../models/swapi.models';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css',
})
export class PlayerCardComponent {
  protected readonly ViewStatus = ViewStatus;
  @Input() subtitle = 'Player';
  @Input() playerData!: SwApiResult;
  @Input() score = 0;

  protected readonly BattleOutcome = BattleOutcome;
}
