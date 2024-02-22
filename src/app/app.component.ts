import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './services/data.service';
import { ViewStatus } from './models/viewStatus';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  protected readonly ViewStatus = ViewStatus;
  viewStatus: ViewStatus = ViewStatus.INITIAL;

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
  ) {}

  onLoadInitialResources(): void {
    this.viewStatus = ViewStatus.LOADING;

    this.dataService.loadAllInitialResources().subscribe({
      error: (_err) => {
        this.viewStatus = ViewStatus.ERROR;
        this.toastr.error('Something went wrong...', 'Preloading failed');
      },
      complete: () => {
        this.viewStatus = ViewStatus.SUCCESS;
      },
    });
  }

}
