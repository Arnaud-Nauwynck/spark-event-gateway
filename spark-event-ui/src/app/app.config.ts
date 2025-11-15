import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { ROUTES } from './app.routes';
import SparkApiService from './services/SparkApiService';
import {provideHttpClient} from '@angular/common/http';
import {SparkGlobalSettingsService} from './services/SparkGlobalSettingsService';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideHttpClient(),
    provideRouter(ROUTES),
    SparkApiService, SparkGlobalSettingsService
  ]
};
