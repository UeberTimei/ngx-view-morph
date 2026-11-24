import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';
import { provideRouter, withViewTransitions } from '@angular/router';
import { provideMorph } from 'ngx-view-morph';

import { routes } from './app.routes';
import { animateCoverWindows } from './morph-window';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    // Browser back/swipe must not move the scroll before the transition: we restore it ourselves.
    provideAppInitializer(() => {
      history.scrollRestoration = 'manual';
    }),
    provideMorph(),
    provideRouter(
      routes,
      withViewTransitions({ skipInitialTransition: true, onViewTransitionCreated: animateCoverWindows }),
    ),
  ],
};
