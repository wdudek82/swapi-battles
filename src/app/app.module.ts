import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatDivider } from '@angular/material/divider';
import { MatProgressBar } from '@angular/material/progress-bar';
import { MatButton } from '@angular/material/button';
import { ToastrModule } from 'ngx-toastr';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar, MatToolbarRow } from '@angular/material/toolbar';
import { NgxLoadingButtonsModule } from 'ngx-loading-buttons';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { PlayerCardComponent } from './components/player-cards/player-card/player-card.component';
import { LoadingScreenComponent } from './components/loading-screen/loading-screen.component';

const materialUIModules = [
  MatCardModule,
  MatProgressSpinnerModule,
  MatProgressBar,
  MatDivider,
  MatButton,
  MatMenu,
  MatMenuItem,
  MatMenuTrigger,
  MatIcon,
  MatToolbar,
  MatToolbarRow,
];

const thirdPartyModules = [NgxLoadingButtonsModule, ToastrModule.forRoot()];

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    PlayerCardComponent,
    LoadingScreenComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ...materialUIModules,
    ...thirdPartyModules,
    AppRoutingModule,
  ],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
