import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ViewStatus } from '../../models/viewStatus';
import { PlayerData } from '../../models/swapi.models';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.css'
})
export class LoadingScreenComponent {
  @Input() viewStatus!: ViewStatus;
  @Input() loadedData!: PlayerData[];

  @Output() loadInitialResources = new EventEmitter<void>();

  protected readonly ViewStatus = ViewStatus;

  onLoadInitialResources() {
    this.loadInitialResources.emit();
  }

  formattedRecordLog(record: PlayerData): string {
    return `[${record.additions.type}] UID: ${record.uid}: ${record.name}`;
  }
}
