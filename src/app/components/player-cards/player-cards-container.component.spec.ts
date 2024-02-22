import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { BattleOutcome, UnitData, UnitType } from '../../models/swapi.models';
import { PlayerCardsContainerComponent } from './player-cards-container.component';
import { PlayerCardComponent } from './player-card/player-card.component';

const mockPlayersData: UnitData[] = [
  {
    uid: '123abc',
    name: 'Żwirek',
    url: 'www.testapi.people/123abc',
    additions: {
      type: UnitType.people,
      battleOutcome: BattleOutcome.NONE,
    },
  },
  {
    uid: '456def',
    name: 'Muchomorek',
    url: 'www.testapi.people/456def',
    additions: {
      type: UnitType.people,
      battleOutcome: BattleOutcome.NONE,
    },
  },
];

describe('PlayerCardsContainerComponent', () => {
  let component: PlayerCardsContainerComponent;
  let fixture: ComponentFixture<PlayerCardsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerCardsContainerComponent, PlayerCardComponent],
      imports: [MatCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerCardsContainerComponent);
    component = fixture.componentInstance;
    component.playersData = mockPlayersData;
    component.scores = [1, 12];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
