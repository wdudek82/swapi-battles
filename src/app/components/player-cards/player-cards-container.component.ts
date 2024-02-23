import { Component, Input } from '@angular/core';
import { UnitData } from '../../models/swapi.models';

@Component({
  selector: 'app-player-cards-container',
  template: `
    <section class="player-cards__container">
      <app-player-card
        *ngFor="let data of playersData; index as i"
        [subtitle]="'Player ' + (i + 1)"
        [playerData]="playersData[i]"
        [score]="scores[i]"
      ></app-player-card>
    </section>
  `,
  styleUrl: 'player-cords-container.component.scss',
})
export class PlayerCardsContainerComponent {
  @Input() playersData!: UnitData[];
  @Input() scores!: number[];
}
