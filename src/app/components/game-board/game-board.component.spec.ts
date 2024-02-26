import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatCardModule } from '@angular/material/card';
import { delay, of, throwError } from 'rxjs';
import { NgxLoadingButtonsModule } from 'ngx-loading-buttons';
import { ToastrModule } from 'ngx-toastr';
import { PlayerCardsContainerComponent } from '../player-cards/player-cards-container.component';
import { GameBoardComponent } from './game-board.component';
import { BattleOutcome, UnitData, UnitType } from '../../models/swapi.models';
import { PlayerCardComponent } from '../player-cards/player-card/player-card.component';
import { ViewStatus } from '../../models/viewStatus';
import { DataService } from '../../services/data.service';
import {
  playersDataListMocksForPeople,
  playersDataListMocksForStarships,
} from '../../mocks/playersData.mocks';

describe('GameBoardComponentComponent', () => {
  let component: GameBoardComponent;
  let fixture: ComponentFixture<GameBoardComponent>;
  let mockDataService: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    mockDataService = jasmine.createSpyObj('DataService', [
      'getRandomResourceOfType',
    ]);

    await TestBed.configureTestingModule({
      declarations: [
        GameBoardComponent,
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
      providers: [{ provide: DataService, useValue: mockDataService }],
    }).compileComponents();

    fixture = TestBed.createComponent(GameBoardComponent);
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
      component.playersData = playersDataListMocksForPeople;
      component.playersViewStatus = ViewStatus.INITIAL;

      fixture.detectChanges();

      expect(component.isFightBtnDisabled).toBeTruthy();
    });

    it('disables "Fight!" button when the state is success, but second player card is missing', () => {
      component.playersData = [playersDataListMocksForPeople[0]];
      component.playersViewStatus = ViewStatus.SUCCESS;

      fixture.detectChanges();

      expect(component.isFightBtnDisabled).toBeTruthy();
    });

    it('enables "Fight!" button when there are players data and state is not initial', () => {
      component.playersData = playersDataListMocksForPeople;
      component.playersViewStatus = ViewStatus.LOADING;

      fixture.detectChanges();

      expect(component.isFightBtnDisabled).toBeFalsy();
    });
  });

  describe('resetBattleOutcomeForPlayers', () => {
    it('resets battle outcome of each player card', () => {
      component.playersData = playersDataListMocksForPeople;

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
      component.playersData = playersDataListMocksForPeople;
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
        of(playersDataListMocksForPeople[0]).pipe(delay(100)),
      );

      component.getRandomResourceOfTypeForPlayers(UnitType.people);

      expect(component.isLoadingResource[UnitType.people]).toBeTrue();
      expect(component.isLoadingResource[UnitType.starships]).toBeFalse();
      expect(component.playersViewStatus).toBe(ViewStatus.LOADING);
    });

    // Test 2: Success
    it('handles successful data retrieval', () => {
      mockDataService.getRandomResourceOfType.and.returnValue(
        of(playersDataListMocksForPeople[0]),
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

  describe('calculateResult', () => {
    let updateScoresSpy: jasmine.Spy;
    const peopleData: UnitData[] = playersDataListMocksForPeople;
    const starshipsData: UnitData[] = playersDataListMocksForStarships;

    beforeEach(() => {
      updateScoresSpy = spyOn<any>(component, 'updateScores');
    });

    // Test 1: People Comparison
    [
      {
        massA: '80',
        massB: '70,500',
        expectedMassA: 80,
        expectedMassB: 70500,
        explanation: 'calculates people scores when both values present',
      },
      {
        massA: '80',
        massB: 'unknown',
        expectedMassA: 80,
        expectedMassB: 0,
        explanation: 'calculates people scores when one value is unknown',
      },
      {
        massA: '80',
        massB: undefined,
        expectedMassA: 80,
        expectedMassB: 0,
        explanation: 'calculates people scores when one value is undefined',
      },
      {
        massA: '80',
        massB: '10-100',
        expectedMassA: 80,
        expectedMassB: 100,
        explanation: 'calculates people scores when one value is range',
      },
    ].forEach(({ massA, massB, expectedMassA, expectedMassB, explanation }) => {
      it(explanation, () => {
        peopleData[0].properties!.mass = massA;
        peopleData[1].properties!.mass = massB;
        component.playersData = playersDataListMocksForPeople;

        component.calculateResult();

        expect(updateScoresSpy).toHaveBeenCalledWith(expectedMassA, expectedMassB);
      });
    });

    // Test 2: Starships Comparison (Similar structure)
    [
      {
        crewA: '80',
        crewB: '70,500',
        expectedCrewA: 80,
        expectedCrewB: 70500,
        explanation: 'calculates starships scores when both values present',
      },
      {
        crewA: '80',
        crewB: 'unknown',
        expectedCrewA: 80,
        expectedCrewB: 0,
        explanation: 'calculates starships scores when one value is unknown',
      },
      {
        crewA: '80',
        crewB: undefined,
        expectedCrewA: 80,
        expectedCrewB: 0,
        explanation: 'calculates starships scores when one value is undefined',
      },
      {
        crewA: '80',
        crewB: '10-100',
        expectedCrewA: 80,
        expectedCrewB: 100,
        explanation: 'calculates starships scores when one value is range',
      },
    ].forEach(({ crewA, crewB, expectedCrewA, expectedCrewB, explanation }) => {
      it(explanation, () => {
        starshipsData[0].properties!.crew = crewA;
        starshipsData[1].properties!.crew = crewB;
        component.playersData = starshipsData;

        component.calculateResult();

        expect(updateScoresSpy).toHaveBeenCalledWith(
          expectedCrewA,
          expectedCrewB,
        );
      });
    });
  });
});
