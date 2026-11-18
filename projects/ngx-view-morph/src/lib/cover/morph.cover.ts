import { DOCUMENT, Injectable, inject } from '@angular/core';

import {
  DEFAULT_MORPH_DURATION_MS,
  DEFAULT_MORPH_EASING,
  MORPH_COVER_CLASS,
  MORPH_RADIUS_PROPERTIES,
  MORPH_TRANSITION_STYLE_ATTR,
} from '../../constants';
import { assertIsRadiiRecord } from './morph.cover.helpers';
import { CoverAnimation, MorphCoverSnapshotStyle } from './morph.cover.types';

export type { CoverAnimation };

/**
 * Animates a Cover element's view-transition group border radius so it scales as
 * one shape. Uses the Web Animations API, with a static `<style>` fallback when
 * WAAPI is unavailable.
 */
@Injectable({ providedIn: 'root' })
export class MorphCoverAnimator {
  private readonly doc = inject(DOCUMENT);

  /**
   * Captures the current Cover radii and appends a fallback `<style>` for them.
   * Call before the old snapshot is taken.
   */
  begin(): CoverAnimation {
    const oldStyles = this.captureCoverStyles();
    const fallbackStyle = this.createTransitionStyleElement();
    let newStyles: MorphCoverSnapshotStyle[] = [];

    if (fallbackStyle) {
      fallbackStyle.textContent = this.renderCoverStyles(oldStyles);
      this.doc.head.appendChild(fallbackStyle);
    }

    return {
      captureNew: () => {
        newStyles = this.captureCoverStyles();
      },
      animate: (ready) => {
        const settled = ready ?? Promise.resolve();
        settled
          .then(() => {
            if (this.runCoverAnimations(oldStyles, newStyles)) {
              return;
            }
            if (fallbackStyle) {
              fallbackStyle.textContent = this.renderCoverStyles(newStyles);
            }
          })
          .catch(() => {
            if (fallbackStyle) {
              fallbackStyle.textContent = this.renderCoverStyles(newStyles);
            }
          });
      },
      cleanup: () => {
        fallbackStyle?.remove();
      },
    };
  }

  private createTransitionStyleElement(): HTMLStyleElement | null {
    const canCreateElement = this.doc.head && typeof this.doc.createElement === 'function';
    if (!canCreateElement) {
      return null;
    }
    const style = this.doc.createElement('style');
    style.setAttribute(MORPH_TRANSITION_STYLE_ATTR, '');
    return style;
  }

  private captureCoverStyles(): MorphCoverSnapshotStyle[] {
    const win = this.doc.defaultView;
    const canQueryElements = win && typeof this.doc.querySelectorAll === 'function';
    if (!canQueryElements) {
      return [];
    }
    const styles: MorphCoverSnapshotStyle[] = [];

    for (const element of Array.from(this.doc.querySelectorAll<HTMLElement>('*'))) {
      const transitionName =
        element.style.getPropertyValue('view-transition-name') ||
        win.getComputedStyle(element).getPropertyValue('view-transition-name');
      const hasTransitionName = transitionName && transitionName !== 'none';
      if (!hasTransitionName) {
        continue;
      }

      const transitionClasses =
        element.style.getPropertyValue('view-transition-class') ||
        win.getComputedStyle(element).getPropertyValue('view-transition-class');
      const isCoverElement = transitionClasses.split(/\s+/).includes(MORPH_COVER_CLASS);
      if (!isCoverElement) {
        continue;
      }

      const computedStyle = win.getComputedStyle(element);
      const radii = Object.fromEntries(
        MORPH_RADIUS_PROPERTIES.map((property) => [
          property,
          computedStyle.getPropertyValue(property),
        ]),
      );
      assertIsRadiiRecord(radii);

      const hasNonZeroRadius = Object.values(radii).some((radius) => radius && radius !== '0px');
      if (hasNonZeroRadius) {
        styles.push({ name: transitionName, radii });
      }
    }

    return styles;
  }

  private renderCoverStyles(styles: MorphCoverSnapshotStyle[]): string {
    const escape =
      this.doc.defaultView?.CSS?.escape?.bind(this.doc.defaultView.CSS) ?? this.escapeCssIdent;
    return styles
      .map(
        ({ name, radii }) =>
          `::view-transition-group(${escape(name)}) { overflow: clip; ${this.renderRadiusDeclarations(radii)} }`,
      )
      .join('\n');
  }

  private runCoverAnimations(
    oldStyles: MorphCoverSnapshotStyle[],
    newStyles: MorphCoverSnapshotStyle[],
  ): boolean {
    const animate = this.doc.documentElement.animate?.bind(this.doc.documentElement);
    if (!animate) {
      return false;
    }

    const newByName = new Map(newStyles.map((style) => [style.name, style]));
    const escape =
      this.doc.defaultView?.CSS?.escape?.bind(this.doc.defaultView.CSS) ?? this.escapeCssIdent;
    const timing = this.morphTiming();
    let animated = false;

    for (const oldStyle of oldStyles) {
      const newStyle = newByName.get(oldStyle.name);
      const radiiUnchanged = !newStyle || this.sameRadii(oldStyle.radii, newStyle.radii);
      if (radiiUnchanged) {
        continue;
      }

      animate([this.toRadiusKeyframe(oldStyle.radii), this.toRadiusKeyframe(newStyle.radii)], {
        ...timing,
        fill: 'both',
        pseudoElement: `::view-transition-group(${escape(oldStyle.name)})`,
      });
      animated = true;
    }

    return animated;
  }

  private morphTiming(): KeyframeAnimationOptions {
    const style = this.doc.defaultView?.getComputedStyle(this.doc.documentElement);
    return {
      duration:
        this.parseTime(style?.getPropertyValue('--morph-duration')) ?? DEFAULT_MORPH_DURATION_MS,
      easing: style?.getPropertyValue('--morph-easing').trim() || DEFAULT_MORPH_EASING,
    };
  }

  private parseTime(value: string | undefined): number | null {
    const time = value?.trim();
    if (!time) {
      return null;
    }
    if (time.endsWith('ms')) {
      return Number.parseFloat(time);
    }
    if (time.endsWith('s')) {
      return Number.parseFloat(time) * 1000;
    }
    return null;
  }

  private toRadiusKeyframe(radii: MorphCoverSnapshotStyle['radii']): Keyframe {
    return {
      borderTopLeftRadius: radii['border-top-left-radius'],
      borderTopRightRadius: radii['border-top-right-radius'],
      borderBottomRightRadius: radii['border-bottom-right-radius'],
      borderBottomLeftRadius: radii['border-bottom-left-radius'],
    };
  }

  private sameRadii(
    first: MorphCoverSnapshotStyle['radii'],
    second: MorphCoverSnapshotStyle['radii'],
  ): boolean {
    return MORPH_RADIUS_PROPERTIES.every((property) => first[property] === second[property]);
  }

  private renderRadiusDeclarations(radii: MorphCoverSnapshotStyle['radii']): string {
    return MORPH_RADIUS_PROPERTIES.map((property) => `${property}: ${radii[property]};`).join(' ');
  }

  private readonly escapeCssIdent = (value: string): string =>
    value.replace(/[^a-zA-Z0-9_-]/g, (char) => `\\${char}`);
}
