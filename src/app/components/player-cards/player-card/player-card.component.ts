import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewStatus } from '../../../models/viewStatus';
import { SwApiResult } from '../../../models/swapi.models';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrl: './player-card.component.css'
})
export class PlayerCardComponent {
  protected readonly ViewStatus = ViewStatus;
  @Input() subtitle = 'Player';
  @Input() viewStatus = ViewStatus.INITIAL;
  @Input() playerData!: SwApiResult;
  @Output() loadResources = new EventEmitter<void>();

  isInitial(): boolean {
    return this.viewStatus === ViewStatus.INITIAL;
  }

  isLoading(): boolean {
    return this.viewStatus === ViewStatus.LOADING;
  }

  hasErrors(): boolean {
    return this.viewStatus === ViewStatus.ERROR;
  }

  isSuccessful(): boolean {
    return this.viewStatus === ViewStatus.SUCCESS;
  }

  onLoadInitialResources(): void {
    this.loadResources.emit();
  }
}
