# Concepts

Short definitions of the words these docs use.

## Morph

A DOM change wrapped in a View Transition so it animates instead of snapping. `MorphService.run` produces one.

## Shared element

An element that carries the same `view-transition-name` in two view states. The browser morphs one into the other, for example a card image into a detail hero. You mark it with `[morph]`.

## Cover

A shared element that must scale as one shape instead of cross-fading two snapshots, such as an image. Opt in with `morphClass="morph-cover"`.

The View Transition API bakes each state's corner radius into its snapshot, so two different radii would snap. To avoid that, the directive forces the same radius on every Cover in both states: `var(--morph-radius, 16px)`. Set `--morph-radius` once, globally.

## Group class

A `view-transition-class` shared by many elements, such as every row in a list. You style the group once with `::view-transition-group(.your-class)`. Set it with `morphClass`.

## Direction-aware transition

A page transition whose slide direction depends on the URLs: going deeper is `forward`, going up is `backward`. Provided by [`provideMorphRouter`](/api/router).

## Fallback

When View Transitions are unavailable, globally disabled, or the user prefers reduced motion, the callback still runs and the DOM updates at once. Only the animation is skipped. See [Accessibility](/guide/accessibility).
