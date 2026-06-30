import { ApplicationRef, DOCUMENT, Injectable, inject, signal } from '@angular/core';

import { MORPH_RUNNING_CLASS } from '../../constants';
import { MorphCoverAnimator } from '../cover/morph.cover';
import { MORPH_CONFIG } from '../morph.config';
import { MorphRunOptions, MorphStatus, MorphTransition } from './morph.service.types';

export { MORPH_RUNNING_CLASS };
export type { MorphRunOptions, MorphStatus, MorphTransition };

/**
 * Core of the morph instrument. Wraps a DOM-mutating callback in the native
 * View Transition API, degrading gracefully when the API is unavailable or the
 * user prefers reduced motion. Delegates Cover-group animation to
 * {@link MorphCoverAnimator}.
 */
@Injectable({ providedIn: 'root' })
export class MorphService {
  private readonly doc = inject(DOCUMENT);
  private readonly config = inject(MORPH_CONFIG);
  private readonly appRef = inject(ApplicationRef);
  private readonly coverAnimator = inject(MorphCoverAnimator);

  /**
   * Runs a DOM mutation as a morph transition, or applies it immediately when
   * transitions are disabled, unsupported, or reduced motion is preferred.
   * @param callback Mutates the DOM to the next state. Must be synchronous.
   * @param options Optional focus target to restore after the transition.
   * @returns A handle exposing the transition status and a completion promise.
   */
  run(callback: () => void, options?: MorphRunOptions): MorphTransition {
    const status = signal<MorphStatus>('running');

    const shouldSkipTransition =
      this.config.disabled ||
      typeof this.doc.startViewTransition !== 'function' ||
      this.prefersReducedMotion();

    if (shouldSkipTransition) {
      callback();
      this.routeFocus(options?.focusTarget);
      status.set('skipped');

      return { status, finished: Promise.resolve() };
    }

    this.doc.documentElement.classList.add(MORPH_RUNNING_CLASS);
    const cover = this.coverAnimator.begin();

    const transition = this.doc.startViewTransition(() => {
      callback();
      this.appRef.tick();
      cover.captureNew();
    });

    cover.animate(transition.ready);

    const finished = transition.finished.finally(() => {
      cover.cleanup();
      this.doc.documentElement.classList.remove(MORPH_RUNNING_CLASS);
      this.routeFocus(options?.focusTarget);
      status.set('done');
    });

    return { status, finished };
  }

  /** Whether the user has asked for reduced motion via the OS/browser setting. */
  private prefersReducedMotion(): boolean {
    const matchMedia = this.doc.defaultView?.matchMedia;

    return typeof matchMedia === 'function'
      ? matchMedia('(prefers-reduced-motion: reduce)').matches
      : false;
  }

  /** Focuses the given element, or the first element matching the given selector. */
  private routeFocus(target: MorphRunOptions['focusTarget']): void {
    if (!target) {
      return;
    }

    const element =
      typeof target === 'string' ? this.doc.querySelector<HTMLElement>(target) : target;

    element?.focus();
  }
}
