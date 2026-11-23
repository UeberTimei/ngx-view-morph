import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMorph } from 'ngx-view-morph';
import { provideMorphRouter } from 'ngx-view-morph/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideMorph(),
    provideRouter(routes, provideMorphRouter({ directionAware: false })),
  ],
};
