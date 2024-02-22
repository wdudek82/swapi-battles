import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameBoardComponentComponent } from './game-board-component.component';

describe('GameBoardComponentComponent', () => {
  let component: GameBoardComponentComponent;
  let fixture: ComponentFixture<GameBoardComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GameBoardComponentComponent]
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
