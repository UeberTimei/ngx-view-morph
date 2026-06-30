import { MORPH_RADIUS_PROPERTIES } from '../../constants';

export interface MorphCoverSnapshotStyle {
  readonly name: string;
  readonly radii: Readonly<Record<(typeof MORPH_RADIUS_PROPERTIES)[number], string>>;
}

/**
 * Per-transition handle for one Cover animation, driven by {@link MorphService.run}
 * in four steps:
 *
 * 1. {@link MorphCoverAnimator.begin} (before the transition) captures the old
 *    radii and writes the fallback `<style>`.
 * 2. {@link CoverAnimation.captureNew} — call inside the VT callback, after the
 *    mutation has been flushed, to capture the new radii.
 * 3. {@link CoverAnimation.animate} — drive the radius interpolation once the
 *    transition is `ready`.
 * 4. {@link CoverAnimation.cleanup} — remove the fallback `<style>` when finished.
 */
export interface CoverAnimation {
  /** Capture the post-mutation Cover radii. Call inside the VT callback. */
  captureNew(): void;
  /** Animate each changed Cover group once the transition is ready. */
  animate(ready: Promise<unknown> | undefined): void;
  /** Remove the fallback style element. Call when the transition finishes. */
  cleanup(): void;
}
