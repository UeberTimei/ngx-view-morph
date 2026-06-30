import { Directive, computed, input } from '@angular/core';

import { MORPH_COVER_CLASS, MORPH_SCOPE_CLASS } from '../../constants';

export { MORPH_COVER_CLASS, MORPH_SCOPE_CLASS };

/**
 * Assigns a `view-transition-name` to the host element so it participates as a
 * shared element in morph transitions driven by {@link MorphService}. Works on
 * any DOM element or component host, regardless of the UI kit.
 *
 * @example
 * ```html
 * <mat-card [morph]="'card-' + id">…</mat-card>
 * ```
 */
@Directive({
  selector: '[morph]',
  host: {
    '[style.view-transition-name]': 'morph()',
    '[style.view-transition-class]': 'vtClass()',
    '[style.border-radius]': 'coverRadius()',
  },
})
export class MorphDirective {
  /** Unique transition name for this element in the current view state. */
  readonly morph = input<string | null>(null);

  /**
   * Shared `view-transition-class` for group transitions (lists: add / remove /
   * reorder). Apply the same class to every item so their animation logic can
   * be defined once via `::view-transition-group(.<class>)`.
   */
  readonly morphClass = input<string | null>(null);

  /**
   * Resolved `view-transition-class`: always includes {@link MORPH_SCOPE_CLASS}
   * so the library's default aspect-ratio-safe styles apply, plus any
   * user-provided {@link morphClass}.
   */
  protected readonly vtClass = computed(() => {
    const userClass = this.morphClass();
    return userClass ? `${MORPH_SCOPE_CLASS} ${userClass}` : MORPH_SCOPE_CLASS;
  });

  /** Whether this element opted into {@link MORPH_COVER_CLASS}. */
  private readonly isCover = computed(() =>
    (this.morphClass() ?? '').split(/\s+/).includes(MORPH_COVER_CLASS),
  );

  /** Forces the shared library radius on Cover hosts so old and new snapshots match. */
  protected readonly coverRadius = computed(() =>
    this.isCover() ? 'var(--morph-radius, 16px)' : null,
  );
}
