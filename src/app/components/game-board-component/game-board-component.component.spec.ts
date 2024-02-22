import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardComponentComponent } from './game-board-component.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ToastrModule } from 'ngx-toastr';
import { MatToolbarModule } from '@angular/material/toolbar';
import { PlayerCardsContainerComponent } from '../player-cards/player-cards-container.component';
import { NgxLoadingButtonsModule } from 'ngx-loading-buttons';

describe('GameBoardComponentComponent', () => {
  let component: GameBoardComponentComponent;
  let fixture: ComponentFixture<GameBoardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameBoardComponentComponent, PlayerCardsContainerComponent],
      imports: [HttpClientTestingModule, MatSlideToggleModule, ToastrModule.forRoot(), MatToolbarModule, NgxLoadingButtonsModule],
    })
    .compileComponents();

    fixture = TestBed.createComponent(GameBoardComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
