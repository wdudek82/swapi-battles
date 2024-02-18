import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { DataService } from './services/data.service';
import { ViewStatus } from './models/viewStatus';
import { Resources, SwApiResult } from './models/swapi.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly ViewStatus = ViewStatus;
  viewStatus = ViewStatus.INITIAL;

  loadedData: SwApiResult[] = [];

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
  ) {}

  onLoadInitialResources(): void {
    this.viewStatus = ViewStatus.LOADING;

    this.dataService.loadInitialResources().subscribe({
      next: (res) => {
        console.log(res);

        res.results.forEach((result) => {
          this.loadedData.unshift({
            uid: result.uid,
            name: result.name,
            url: result.url,
            type: result.url.includes('people')
              ? Resources.people
              : Resources.starships,
          });
        });
      },
      error: (err) => {
        console.error(err);

        this.viewStatus = ViewStatus.ERROR;
        this.toastr.error('Something went wrong...', 'Preloading failed');
      },
      complete: () => {
        this.viewStatus = ViewStatus.SUCCESS;
        this.toastr.success(`Resources preloaded successfully`, `Success`);
      },
    });
  }

  getRandomPerson(): void {
    this.dataService.getRandomPerson().subscribe((data) => {
      console.log('AppComponent | person:', data);

      // TODO: Move toasts to a separate methods/service
      if (!data) {
        this.toastr.warning(
          'Please reload people data and try again',
          'No people data',
        );
      }

      this.toastr.success(
        'Person loaded successfully',
        'Loaded',
      );
    });
  }

  getRandomStarship(): void {
    this.dataService.getRandomStarship().subscribe((data) => {
      console.log('AppComponent | starship:', data);

      // TODO: Move toasts to a separate methods/service
      if (!data) {
        this.toastr.warning(
          'Please reload spaceships data and try again',
          'No spaceships data',
        );
      }

      this.toastr.success(
        'Spaceships loaded successfully',
        'Loaded',
      );
    });
  }
}
