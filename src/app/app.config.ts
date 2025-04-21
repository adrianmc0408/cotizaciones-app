import { ApplicationConfig, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideServiceWorker } from '@angular/service-worker';
import { SwUpdateService } from './services/sw-update.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerImmediately',
      scope: '/'
    }),
    SwUpdateService
  ]
};
