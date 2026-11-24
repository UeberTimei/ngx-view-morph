import { Directive, Input } from '@angular/core';

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
  standalone: true,
  host: {
    '[style.view-transition-name]': 'transitionName',
    '[style.view-transition-class]': 'viewTransitionClass',
    '[style.border-radius]': 'coverRadius',
    '[attr.data-morph-window]': 'windowAttr',
  },
})
export class MorphDirective {
  /**
   * Unique transition name for this element in the current view state. Pass
   * `'auto'` to let the browser name it (`match-element`, Chrome 137+); browsers
   * without support just skip the morph for that element.
   */
  @Input() morph: string | null = null;

  /**
   * Shared `view-transition-class` for group transitions (lists: add / remove /
   * reorder). Apply the same class to every item so their animation logic can
   * be defined once via `::view-transition-group(.<class>)`.
   */
  @Input() morphClass: string | null = null;

  /**
   * Marks the host as the whole, uncropped photo that two screens crop differently. With the
   * router feature `provideMorphRouter`, the transition group is clipped to each screen's frame
   * (the host's parent), so the photo morphs as one picture instead of two crossfading crops.
   * Write it as a bare attribute: `<img morph="x" morphWindow />`.
   */
  @Input() morphWindow: boolean | '' = false;

  protected get windowAttr(): '' | null {
    return this.morphWindow === false ? null : '';
  }

  protected get transitionName(): string | null {
    return this.morph === 'auto' ? 'match-element' : this.morph;
  }

  /** Always includes {@link MORPH_SCOPE_CLASS}, plus any user-provided {@link morphClass}. */
  protected get viewTransitionClass(): string {
    return this.morphClass ? `${MORPH_SCOPE_CLASS} ${this.morphClass}` : MORPH_SCOPE_CLASS;
  }

  /** Forces the shared library radius on Cover hosts so old and new snapshots match. */
  protected get coverRadius(): string | null {
    const isCover = (this.morphClass ?? '').split(/\s+/).includes(MORPH_COVER_CLASS);
    return isCover ? 'var(--morph-radius, 16px)' : null;
  }
}
