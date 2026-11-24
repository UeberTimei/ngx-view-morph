import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideMorph } from 'ngx-view-morph';
import { provideMorphRouter } from 'ngx-view-morph/router';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Browser back/swipe must not move the scroll before the transition: we restore it ourselves.
    provideAppInitializer(() => {
      history.scrollRestoration = 'manual';
    }),
    provideMorph(),
    provideRouter(routes, provideMorphRouter({ directionAware: false })),
  ],
};
