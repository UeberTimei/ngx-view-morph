import { ViewTransitionsFeature, withViewTransitions } from '@angular/router';

import { morphDirection } from './morph.router.helpers';
import { MorphDirection, MorphRouterOptions } from './morph.router.types';

export type { MorphDirection, MorphRouterOptions };

/**
 * Router feature that enables morph view transitions on page navigations.
 * Pass it as a feature to `provideRouter`.
 *
 * @example
 * ```ts
 * provideRouter(routes, provideMorphRouter({ directionAware: true }))
 * ```
 */
export function provideMorphRouter(options: MorphRouterOptions = {}): ViewTransitionsFeature {
  return withViewTransitions({
    skipInitialTransition: options.skipInitialTransition ?? true,
    onViewTransitionCreated: ({ transition, from, to }) => {
      if (!options.directionAware) {
        return;
      }
      const direction = morphDirection(from.url.join('/'), to.url.join('/'));
      const root = document.documentElement;
      root.dataset['morphDirection'] = direction;

      transition.finished.finally(() => {
        delete root.dataset['morphDirection'];
      });
    },
  });
}
