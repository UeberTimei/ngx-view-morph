/** Scope class applied to every element managed by `MorphDirective`. */
export const MORPH_SCOPE_CLASS = 'ngx-morph';

/** `view-transition-class` an element opts into to become a Cover group. */
export const MORPH_COVER_CLASS = 'morph-cover';

/** Marks the `<style>` element holding the Cover fallback declarations. */
export const MORPH_TRANSITION_STYLE_ATTR = 'data-ngx-morph-transition-styles';

export const MORPH_RADIUS_PROPERTIES = [
  'border-top-left-radius',
  'border-top-right-radius',
  'border-bottom-right-radius',
  'border-bottom-left-radius',
] as const;

export const DEFAULT_MORPH_DURATION_MS = 300;
export const DEFAULT_MORPH_EASING = 'cubic-bezier(0.2, 0, 0, 1)';

/**
 * Class set on the document element while a service-driven morph is running.
 * The library stylesheet uses it to suppress the root transition
 * (`:root.ngx-morph-running { view-transition-name: none }`).
 */
export const MORPH_RUNNING_CLASS = 'ngx-morph-running';
