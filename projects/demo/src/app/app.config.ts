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
    provideRouter(
      routes,
      provideMorphRouter({
        // A backdrop-filter on a named element leaks its glass over the whole transition layer.
        onTransition: (transition) => {
          document.documentElement.classList.add('vt-active');
          void transition.finished.finally(() =>
            document.documentElement.classList.remove('vt-active'),
          );
        },
      }),
    ),
  ],
};
