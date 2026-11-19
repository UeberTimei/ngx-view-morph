# Browser support

The library uses the native View Transition API. It adds no polyfill.

| Feature | Needs |
| --- | --- |
| Same-document transitions (`MorphService`, router) | Chrome 111, Edge 111, Safari 18, Firefox 144 |
| `view-transition-class` (group styling) | Chrome 125, Safari 18.2, Firefox 144 |
| `morph="auto"` (`match-element`) | Chrome 137 |

Check current numbers on [caniuse](https://caniuse.com/view-transitions) before you rely on them.

## Where it is unsupported

Nothing breaks. `MorphService.run` calls your callback directly, updates the view, and returns a transition whose status is `skipped`. The same happens when `disabled` is set.

Treat the animation as an enhancement, and make sure the app works with it off.

## Server-side rendering

On the server there is no `document.startViewTransition`, so `run` takes the fallback path. The router feature also reads `document` through Angular's `DOCUMENT` token, not the global.
