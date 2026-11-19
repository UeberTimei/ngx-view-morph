# Accessibility

## Reduced motion

The default stylesheet turns off every transition animation under `prefers-reduced-motion: reduce`. The state change still happens. Only the movement is removed.

If you skip the stylesheet, add the same rule yourself:

```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-group(*),
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation: none !important;
  }
}
```

## Turn animations off

For a settings toggle, SSR or tests, disable morphs globally:

```ts
provideMorph({ disabled: true });
```

Callbacks passed to `MorphService.run` still run, so the app behaves the same, only without animation.

## Focus

A morph does not move keyboard focus. When the view changes, pass `focusTarget` so focus lands somewhere sensible:

```ts
this.morph.run(() => this.selected.set(card), { focusTarget: '#detail-heading' });
```

## Interaction during a morph

The transition overlay ignores pointer events, so the page stays clickable and no click is lost.
