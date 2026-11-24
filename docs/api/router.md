# Router

Imported from the secondary entry point. It needs `@angular/router` 17 or newer.

```ts
import { provideMorphRouter, morphDirection } from 'ngx-view-morph/router';
```

## `provideMorphRouter(options?)`

Returns a router feature. Pass it to `provideRouter`.

```ts
provideRouter(routes, provideMorphRouter({ directionAware: true }));
```

It wraps Angular's `withViewTransitions`.

### `MorphRouterOptions`

| Option | Type | Default | Description |
| --- | --- | --- | --- |
| `directionAware` | `boolean` | `false` | Set `data-morph-direction` on `<html>` while a navigation transition runs. |
| `skipInitialTransition` | `boolean` | `true` | Do not animate the first navigation. |
| `onTransition` | `(transition: ViewTransition) => void` | none | Called for every route view transition. |

Photos marked with `morphWindow` need no extra setup. `provideMorphRouter` animates their clip automatically. See [Differently cropped photos](/guide/photo-window).

## `morphDirection(fromUrl, toUrl)`

```ts
morphDirection(fromUrl: string, toUrl: string): MorphDirection
```

Returns `'backward'` when the target URL is shallower than the source, otherwise `'forward'`. Depth is the number of non-empty path segments. The query string and hash are ignored.

```ts
morphDirection('/list', '/list/42'); // 'forward'
morphDirection('/list/42', '/list'); // 'backward'
morphDirection('/a', '/b'); // 'forward'
```

## `MorphDirection`

`'forward' | 'backward'`
