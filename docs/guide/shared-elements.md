# Shared elements

The classic case: a card in a grid morphs into a detail view.

## The rule

The browser pairs elements by `view-transition-name`. A name must be unique within one view state. If two elements carry the same name at the same time, the browser skips the transition.

## Card to detail

The grid has many cards, but only the clicked one should carry the shared name. So you name it just before the transition starts.

```html
<!-- grid -->
@for (card of cards; track card.id) {
<div
  [morph]="morphingId() === card.id ? 'hero' : null"
  morphClass="morph-cover"
  [style.background]="card.color"
></div>
}

<!-- detail -->
<div morph="hero" morphClass="morph-cover" [style.background]="card().color"></div>
```

```ts
open(card: Card): void {
  this.morphingId.set(card.id);   // 1. name the clicked card
  this.appRef.tick();             // 2. flush, so the name is in the DOM before the old snapshot
  this.morph.run(() => this.selected.set(card), { focusTarget: '#detail-heading' });
}

close(): void {
  const transition = this.morph.run(() => this.selected.set(null));
  // drop the name only after the morph back has finished
  void transition.finished.finally(() => this.morphingId.set(null));
}
```

Why the `tick()`: Angular updates the DOM on its own schedule. The old snapshot is taken as soon as `run` is called, so the name has to be in the DOM by then.

## Covers

Add `morphClass="morph-cover"` to images and other blocks that should scale as one shape. The directive sets `border-radius: var(--morph-radius, 16px)` on them in both states.

A cover is found by its inline style, which `MorphDirective` writes. A name set only in a stylesheet is not picked up.

## Text

Text such as a card title can be a shared element too. Give the title in both views the same name and it moves and resizes with the image.

## Focus

Pass `focusTarget` to move focus when the transition ends. It takes an element or a selector. This keeps keyboard and screen reader users oriented after the view changes.
