# Page transitions

Animate router navigation with one router feature. It needs `@angular/router` 17 or newer.

## Enable it

```ts
import { provideRouter } from '@angular/router';
import { provideMorphRouter } from 'ngx-view-morph/router';

export const appConfig = {
  providers: [provideRouter(routes, provideMorphRouter())],
};
```

`provideMorphRouter` is a thin wrapper around Angular's `withViewTransitions`. See the [router API](/api/router) for its options.

## Direction-aware slides

With `directionAware: true`, the library compares the URL depth of the old and new page. Going deeper, such as `/list` to `/list/42`, is `forward`. Going up is `backward`. While the transition runs, it sets `data-morph-direction` on the `<html>` element, and removes it when the transition ends.

```ts
provideRouter(routes, provideMorphRouter({ directionAware: true }));
```

The default stylesheet already reacts to the attribute: the old page slides out and the new one slides in from the matching side. To restyle it:

```css
:root[data-morph-direction='forward']::view-transition-new(root) {
  animation-name: my-slide-in;
}
```

Equal depth counts as `forward`.

## The first load

By default the very first navigation is not animated, because there is no old page to leave. To animate it anyway:

```ts
provideMorphRouter({ skipInitialTransition: false });
```

## Combine with shared elements

Page transitions and shared elements work together. Give an element on both routes the same `[morph]` name and it morphs across the navigation while the rest of the page slides.
