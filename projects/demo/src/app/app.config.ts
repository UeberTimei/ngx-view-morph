import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMorph, provideMorphRouter } from 'ngx-view-morph';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideMorph(),
    provideRouter(routes, provideMorphRouter({ directionAware: true })),
  ],
};
