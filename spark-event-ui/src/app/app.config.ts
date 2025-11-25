import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import {provideRouter, withHashLocation} from '@angular/router';
// import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

import { ROUTES } from './app.routes';
import SparkApiService from './services/SparkApiService';
import {provideHttpClient} from '@angular/common/http';
import {SparkGlobalSettingsService} from './services/SparkGlobalSettingsService';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    // provideAnimationsAsync(),
    provideHttpClient(),
    provideRouter(ROUTES, withHashLocation()),
    // Bootstrap
    NgbModule,

    // Prime-NG
    providePrimeNG({
      theme: {
        preset: Aura
      }
    }),

    // Application
    SparkApiService,
    SparkGlobalSettingsService
  ]
};
