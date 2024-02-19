import { Component, Input } from '@angular/core';
import { BattleOutcome, UnitType, PlayerData } from '../../../models/swapi.models';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css',
})
export class PlayerCardComponent {
  protected readonly BattleOutcome = BattleOutcome;
  @Input() subtitle = 'Player';
  @Input() playerData!: PlayerData;
  @Input() score = 0;

  protected readonly BattleOutcome = BattleOutcome;
}
