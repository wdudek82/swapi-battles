import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatCardModule } from '@angular/material/card';
import { PlayerCardComponent } from './player-card.component';
import {
  BattleOutcome,
  UnitData,
  UnitType,
} from '../../../models/swapi.models';

const mockPlayerData: UnitData = {
  uid: '123abc',
  name: 'Krecik',
  url: 'www.testapi.people/123abc',
  additions: {
    type: UnitType.people,
    battleOutcome: BattleOutcome.NONE,
  },
};

describe('PlayerCardComponent', () => {
  let component: PlayerCardComponent;
  let fixture: ComponentFixture<PlayerCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerCardComponent],
      imports: [MatCardModule],
    }).compileComponents();

    fixture = TestBed.createComponent(PlayerCardComponent);
    component = fixture.componentInstance;
    component.playerData = mockPlayerData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
