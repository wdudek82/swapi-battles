import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
} from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { NgxLoadingButtonsModule } from 'ngx-loading-buttons';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { PlayerCardsContainerComponent } from '../player-cards/player-cards-container.component';
import { GameBoardComponentComponent } from './game-board-component.component';
import { BattleOutcome, UnitData, UnitType } from '../../models/swapi.models';
import { PlayerCardComponent } from '../player-cards/player-card/player-card.component';
import { ViewStatus } from '../../models/viewStatus';
import { DataService } from '../../services/data.service';
import { delay, of, throwError } from 'rxjs';

const playersDataListMocks: UnitData[] = [
  {
    uid: '1',
    name: 'Foo',
    url: 'https://api/people/1',
    additions: {
      battleOutcome: BattleOutcome.NONE,
      type: UnitType.people,
    },
  },
  {
    uid: '2',
    name: 'Bar',
    url: 'https://api/people/2',
    additions: {
      battleOutcome: BattleOutcome.NONE,
      type: UnitType.people,
    },
  },
];

describe('GameBoardComponentComponent', () => {
  let component: GameBoardComponentComponent;
  let fixture: ComponentFixture<GameBoardComponentComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;
  let mockToastr: jasmine.SpyObj<ToastrService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', [
      'getRandomResourceOfType',
    ]);
    mockToastr = jasmine.createSpyObj('ToastrService', [
      'showRandomItemWarning',
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        GameBoardComponentComponent,
        PlayerCardsContainerComponent,
        PlayerCardComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatCardModule,
        MatSlideToggleModule,
        ToastrModule.forRoot(),
        MatToolbarModule,
        NgxLoadingButtonsModule,
      ],
      providers: [
        { provide: DataService, useValue: mockDataService },
        { provide: ToastrService, useValue: mockToastr },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('isFightBtnDisabled', () => {
    it('renders the component with "Fight!" button disabled', () => {
      expect(component.isFightBtnDisabled).toBeTruthy();
    });

    it('disables "Fight!" button when there are players data but state is initial', () => {
      component.playersData = playersDataListMocks;
      component.playersViewStatus = ViewStatus.INITIAL;

      fixture.detectChanges();

      expect(component.isFightBtnDisabled).toBeTruthy();
    });

    it('disables "Fight!" button when the state is success, but second player card is missing', () => {
      component.playersData = [playersDataListMocks[0]];
      component.playersViewStatus = ViewStatus.SUCCESS;

      fixture.detectChanges();

      expect(component.isFightBtnDisabled).toBeTruthy();
    });

    it('enables "Fight!" button when there are players data and state is not initial', () => {
      component.playersData = playersDataListMocks;
      component.playersViewStatus = ViewStatus.LOADING;

      fixture.detectChanges();

      expect(component.isFightBtnDisabled).toBeFalsy();
    });
  });

  describe('resetBattleOutcomeForPlayers', () => {
    it('resets battle outcome of each player card', () => {
      component.playersData = playersDataListMocks;

      const resetBattleOutcomeForPlayersSpy = spyOn<any>(
        component,
        'resetBattleOutcomeForPlayers',
      ).and.callThrough();

      [
        [BattleOutcome.NONE, BattleOutcome.NONE],
        [BattleOutcome.TIE, BattleOutcome.TIE],
        [BattleOutcome.VICTORY, BattleOutcome.DEFEAT],
        [BattleOutcome.DEFEAT, BattleOutcome.VICTORY],
      ].forEach(([outcomeA, outcomeB]) => {
        component.playersData[0].additions.battleOutcome = outcomeA;
        component.playersData[1].additions.battleOutcome = outcomeB;

        resetBattleOutcomeForPlayersSpy.call(component);

        expect(component.playersData[0].additions.battleOutcome).toBe(
          BattleOutcome.NONE,
        );
        expect(component.playersData[1].additions.battleOutcome).toBe(
          BattleOutcome.NONE,
        );
      });
    });
  });

  describe('updateScores', () => {
    it('compares player properties and updates the game scores', () => {
      component.playersData = playersDataListMocks;
      expect(component.scores).toEqual([0, 0]);

      const updateScoresSpy = spyOn<any>(
        component,
        'updateScores',
      ).and.callThrough();

      [
        {
          a: 0,
          b: 0,
          battleOutcomeA: BattleOutcome.TIE,
          battleOutcomeB: BattleOutcome.TIE,
        },
        {
          a: 1,
          b: 0,
          battleOutcomeA: BattleOutcome.VICTORY,
          battleOutcomeB: BattleOutcome.DEFEAT,
        },
        {
          a: 1,
          b: 1,
          battleOutcomeA: BattleOutcome.TIE,
          battleOutcomeB: BattleOutcome.TIE,
        },
        {
          a: 1,
          b: 2,
          battleOutcomeA: BattleOutcome.DEFEAT,
          battleOutcomeB: BattleOutcome.VICTORY,
        },
      ].forEach(({ a, b, battleOutcomeA, battleOutcomeB }) => {
        updateScoresSpy.call(component, a, b);
        fixture.detectChanges();

        expect(component.playersData[0].additions.battleOutcome).toBe(
          battleOutcomeA,
        );
        expect(component.playersData[1].additions.battleOutcome).toBe(
          battleOutcomeB,
        );
      });
    });
  });

  describe('getRandomResourceOfTypeForPlayers', () => {
    // Test 1: Loading State
    it('sets correct state when loading resources', () => {
      mockDataService.getRandomResourceOfType.and.returnValue(
        of(playersDataListMocks[0]).pipe(delay(100)),
      );

      component.getRandomResourceOfTypeForPlayers(UnitType.people);

      expect(component.isLoadingResource[UnitType.people]).toBeTrue();
      expect(component.isLoadingResource[UnitType.starships]).toBeFalse();
      expect(component.playersViewStatus).toBe(ViewStatus.LOADING);
    });

    // Test 2: Success
    it('handles successful data retrieval', () => {
      mockDataService.getRandomResourceOfType.and.returnValue(
        of(playersDataListMocks[0]),
      );

      expect(component.playersData.length).toBe(0);

      component.getRandomResourceOfTypeForPlayers(UnitType.starships);

      fixture.detectChanges();

      expect(component.playersData.length).toBe(2);
      expect(component.playersViewStatus).toBe(ViewStatus.SUCCESS);
      expect(component.isLoadingResource[UnitType.people]).toBeFalse();
      expect(component.isLoadingResource[UnitType.starships]).toBeFalse();
    });

    // Test 2: Error
    it('handles error during data retrieval', () => {
      const showRandomItemWarningSpy = spyOn<any>(
        component,
        'showRandomItemWarning',
      );
      mockDataService.getRandomResourceOfType.and.returnValue(
        throwError(() => new Error('Failed loading')),
      );

      expect(component.playersData.length).toBe(0);

      component.getRandomResourceOfTypeForPlayers(UnitType.starships);

      fixture.detectChanges();

      expect(showRandomItemWarningSpy).toHaveBeenCalled();
      expect(component.playersData.length).toBe(0);
      expect(component.playersViewStatus).toBe(ViewStatus.ERROR);
      expect(component.isLoadingResource[UnitType.people]).toBeFalse();
      expect(component.isLoadingResource[UnitType.starships]).toBeFalse();
    });
  });
});
