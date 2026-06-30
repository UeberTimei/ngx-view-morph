import { Signal } from '@angular/core';

/** Lifecycle status of a morph transition. */
export type MorphStatus = 'running' | 'done' | 'skipped';

/** Options controlling a single morph transition. */
export interface MorphRunOptions {
  /** Element (or selector) to receive focus after the transition finishes. */
  focusTarget?: HTMLElement | string | null;
}

/** Handle returned from {@link MorphService.run}. */
export interface MorphTransition {
  /** Reactive status of the transition. */
  readonly status: Signal<MorphStatus>;
  /** Resolves when the transition (or its synchronous fallback) is complete. */
  readonly finished: Promise<void>;
}
