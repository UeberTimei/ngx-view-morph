# Styling

The default stylesheet is optional but recommended:

```scss
@use 'ngx-view-morph/styles/morph';
```

## Custom properties

Override them on `:root`, or on any ancestor for a local change.

| Property | Default | Controls |
| --- | --- | --- |
| `--morph-duration` | `300ms` | Length of every morph |
| `--morph-easing` | `cubic-bezier(0.2, 0, 0, 1)` | Easing of every morph |
| `--morph-radius` | `16px` | Corner radius forced on Cover elements |

```css
:root {
  --morph-duration: 450ms;
  --morph-easing: ease-in-out;
  --morph-radius: 24px;
}
```

## What the stylesheet does

- Sets duration and easing on `::view-transition-group(*)`.
- Disables pointer events on the transition overlay.
- Removes the root snapshot while a service-driven morph runs (`:root.ngx-morph-running`), so only shared elements move and the page does not cross-fade.
- Styles `.morph-cover` so a Cover scales as one shape.
- Animates `.morph-list-item` rows in and out (fade plus a 1rem rise).
- Slides pages for `data-morph-direction="forward|backward"`.
- Turns all animation off under `prefers-reduced-motion: reduce`.

## Your own animations

Every element managed by `MorphDirective` has the `ngx-morph` class in its `view-transition-class`, so you can target all of them at once:

```css
::view-transition-group(.ngx-morph) {
  animation-duration: 600ms;
}
```

Or target one group class that you set with `morphClass`:

```css
::view-transition-old(.my-card):only-child {
  animation: 200ms ease-out both fade-out;
}
```

## Without the stylesheet

Skip the import and write the `::view-transition-*` rules yourself. The directive and the service keep working. They only set names, classes and the Cover radius.
