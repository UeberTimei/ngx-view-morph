# Differently cropped photos

A photo often appears on two screens with different crops: a 4:5 card tile in a grid, and a wide full-bleed hero on the detail view. If you name each cropped frame, the browser takes two different snapshots and crossfades between them. The result looks like two pictures swapping.

Name the whole uncropped photo on both screens instead, and add the `morphWindow` attribute.

## Markup

```html
<!-- card -->
<span class="frame">
  <img [src]="photo" [morph]="'dest-' + slug" morphWindow />
</span>

<!-- detail -->
<figure class="stage">
  <div class="hero" [morph]="'dest-' + slug" morphWindow>
    <img [src]="photo" />
  </div>
</figure>
```

With `provideMorphRouter`, the attribute animates a `clip-path` on the transition group. The clip grows from the old frame (the marked element's parent) to the new one, so one picture visibly moves from the card into the hero and back.

## Size the photo the same way on both screens

The clip only reveals the photo. Both screens must size the uncropped photo to the same aspect ratio, so the picture lines up under the clip.

```css
.frame,
.stage {
  container-type: size;
  position: relative;
  --photo-ratio: 1.25; /* width / height of the photo */
}

.frame > img,
.stage > .hero {
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  width: max(100cqw, 100cqh * var(--photo-ratio));
  aspect-ratio: var(--photo-ratio);
}
```

## Rules

- Draw overlays inside the marked element. Put a scrim or a label in its `::after`. An overlay outside the element stays on the page as its own rectangle during the transition.
- Fade overlays in after the morph lands: `animation-delay: calc(var(--morph-duration) + 50ms)`.
- Do not set `backdrop-filter` on a marked element. It leaks over the whole transition layer. Turn it off during route transitions with the `onTransition` option (see [Router](/api/router)).

## Requirements

- Import `provideMorphRouter` from `ngx-view-morph/router`, with `@angular/router` 17 or newer.
- Without `provideMorphRouter`, the attribute does nothing.

The first clip is applied before the first frame. The clip animation starts on the same frame as the browser's group animation and reads `--morph-duration` and `--morph-easing`.
