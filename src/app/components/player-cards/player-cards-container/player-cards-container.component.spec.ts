import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerCardsContainerComponent } from './player-cards-container.component';

describe('PlayerCardsContainerComponent', () => {
  let component: PlayerCardsContainerComponent;
  let fixture: ComponentFixture<PlayerCardsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlayerCardsContainerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayerCardsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
