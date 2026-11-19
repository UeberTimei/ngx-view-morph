/** Navigation direction used to drive forward/back transition styling. */
export type MorphDirection = 'forward' | 'backward';

/** Options for {@link provideMorphRouter}. */
export interface MorphRouterOptions {
  /**
   * When true, sets `data-morph-direction="forward|backward"` on the document
   * element during each transition so CSS can animate accordingly.
   */
  directionAware?: boolean;
  /** Skip the view transition on the very first (initial) navigation. */
  skipInitialTransition?: boolean;
}
