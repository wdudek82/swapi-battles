import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Observable } from 'rxjs';
import { ViewStatus } from '../../models/viewStatus';
import { UnitData } from '../../models/swapi.models';
import { DataService } from '../../services/data.service';

@Component({
  selector: 'app-loading-screen',
  templateUrl: './loading-screen.component.html',
  styleUrl: './loading-screen.component.css',
})
export class LoadingScreenComponent implements OnInit {
  protected readonly ViewStatus = ViewStatus;
  @Input() viewStatus!: ViewStatus;
  @Output() loadInitialResources = new EventEmitter<void>();

  loadedGameData$!: Observable<UnitData[]>;

  constructor(private dataService: DataService) {}

  ngOnInit(): void {
    this.loadedGameData$ = this.dataService.loadedGameData$;
  }

  onLoadInitialResources() {
    this.loadInitialResources.emit();
  }
}
