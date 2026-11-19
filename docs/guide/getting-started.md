# Getting started

`ngx-view-morph` wraps the native [View Transition API](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API) so a state change animates with one call. It works with any UI kit.

## Requirements

- Angular 16 to 22 (`@angular/common` and `@angular/core`, `>=16.0.0 <23.0.0`).
- `@angular/router` 17 or newer, only if you use [page transitions](/guide/page-transitions).
- A browser with View Transitions for the animation. Other browsers get an instant update. See [Browser support](/guide/browser-support).

## Install

```bash
npm install ngx-view-morph
```

## Add the default styles

Import the stylesheet once in your global styles. It defines the timing, the list animations and the directional page slides.

```scss
// styles.scss
@use 'ngx-view-morph/styles/morph';
```

Everything is a CSS custom property, so you can tune it later. See [Styling](/guide/styling).

## Your first morph

1. Give the element in the "before" state and the element in the "after" state the same name:

   ```html
   <!-- list view -->
   <img [morph]="'photo-' + id" [src]="url" />

   <!-- detail view -->
   <img [morph]="'photo-' + id" [src]="url" />
   ```

2. Wrap the state change in `MorphService.run`:

   ```ts
   import { Component, inject, signal } from '@angular/core';
   import { MorphDirective, MorphService } from 'ngx-view-morph';

   @Component({
     selector: 'app-gallery',
     imports: [MorphDirective],
     templateUrl: './gallery.html',
   })
   export class Gallery {
     private readonly morph = inject(MorphService);
     protected readonly selectedId = signal<string | null>(null);

     open(id: string): void {
       this.morph.run(() => this.selectedId.set(id));
     }
   }
   ```

The browser snapshots the page, runs your callback, snapshots again, and morphs the shared elements from one state to the other.

## Optional setup

You do not need either of these for the example above.

```ts
import { provideMorph } from 'ngx-view-morph';
import { provideMorphRouter } from 'ngx-view-morph/router';

bootstrapApplication(App, {
  providers: [
    provideMorph({ disabled: false }), // turn every morph off globally
    provideRouter(routes, provideMorphRouter({ directionAware: true })), // animate navigation
  ],
});
```

## Where to go next

- [Concepts](/guide/concepts): the vocabulary used everywhere in these docs.
- [Shared elements](/guide/shared-elements): card to detail, step by step.
- [Lists](/guide/lists): add, remove and reorder.
- [`MorphService`](/api/morph-service): the full `run` contract.
