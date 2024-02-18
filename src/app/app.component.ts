import { Component, OnInit } from '@angular/core';
import { Resources } from './models/swapi.models';
import { DataService } from './services/data.service';
import { ToastrService } from 'ngx-toastr';

enum ViewStatus {
  INITIAL = 'initial',
  LOADING = 'loading',
  ERROR = 'error',
  SUCCESS = 'success',
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  protected readonly ViewStatus = ViewStatus;
  viewStatus = ViewStatus.INITIAL;

  loadedData: any[] = [];

  constructor(
    private dataService: DataService,
    private toastr: ToastrService,
  ) {}

  loadInitialResources(): void {
    this.viewStatus = ViewStatus.LOADING;

    this.dataService.loadInitialResources().subscribe({
      next: (res) => {
        console.log(res);

        res.results.forEach((result) => {
          this.loadedData.unshift({
            type: result.url.includes('people') ? 'person' : 'starship',
            uid: result.uid,
            name: result.name,
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
    });
  }

  getRandomStarship(): void {
    this.dataService.getRandomStarship().subscribe((data) => {
      console.log('AppComponent | starship:', data);
    });
  }

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
}
