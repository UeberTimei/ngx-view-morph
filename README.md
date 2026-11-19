# ngx-view-morph

Shared-element morph transitions for Angular, built on the native [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API). Works with any UI kit.

Degrades gracefully when the browser lacks View Transition support or the user prefers reduced motion: the DOM mutation still runs, just without the animation.

## Requirements

- Angular `^21.2.0` (peer dependency: `@angular/common`, `@angular/core`)
- A browser that supports the View Transition API for the animated experience (others get an instant DOM update instead)

## Install

```bash
npm install ngx-view-morph
```

## Setup

Register the global config (optional — disables animations, e.g. for SSR or tests):

```ts
import { provideMorph } from 'ngx-view-morph';

bootstrapApplication(App, {
  providers: [provideMorph({ disabled: false })],
});
```

For router-driven page transitions, add the router feature:

```ts
import { provideRouter } from '@angular/router';
import { provideMorphRouter } from 'ngx-view-morph/router';

provideRouter(routes, provideMorphRouter({ directionAware: true }));
```

## Usage

### Mark shared elements

Add `[morph]` to any element that should participate in a transition. Give matching elements in the "before" and "after" states the same name.

```html
<mat-card [morph]="'card-' + id">…</mat-card>
```

### Trigger a transition

Wrap the DOM mutation (state change, navigation, list update) in `MorphService.run`:

```ts
import { MorphService } from 'ngx-view-morph';

export class ProductListComponent {
  private readonly morph = inject(MorphService);

  openDetail(id: string): void {
    this.morph.run(() => this.selectedId.set(id), { focusTarget: '#detail-heading' });
  }
}
```

`run` returns `{ status, finished }` — `status` is a signal (`'running' | 'skipped' | 'done'`), `finished` is a promise that resolves when the transition completes.

### Group transitions (lists)

Give every item in a list the same `morphClass` so add/remove/reorder animations can be styled once via `::view-transition-group(.your-class)`:

```html
@for (item of items(); track item.id) {
<div [morph]="'item-' + item.id" morphClass="list-item">…</div>
}
```

## API

| Export                                 | Purpose                                                                   |
| -------------------------------------- | ------------------------------------------------------------------------- |
| `MorphDirective` (`[morph]`)           | Assigns `view-transition-name` to the host element                        |
| `MorphService.run(callback, options?)` | Runs a DOM mutation (sync or async) inside a view transition             |
| `provideMorph(config?)`                | Registers global config (`disabled`)                                      |
| `provideMorphRouter(options?)`         | Enables view transitions on router navigation, optionally direction-aware |
| `morphDirection(fromUrl, toUrl)`       | Derives `'forward' \| 'backward'` from URL depth                          |

## Repository layout

This is an Angular workspace containing the library (`projects/ngx-view-morph`) and a demo app (`projects/demo`) used for local development.
