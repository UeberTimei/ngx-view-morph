import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { MorphConfig } from './morph.config.types';

export type { MorphConfig };

/** Default configuration applied when {@link provideMorph} is not used. */
export const DEFAULT_MORPH_CONFIG: MorphConfig = {
  disabled: false,
};

/** DI token carrying the resolved {@link MorphConfig}. */
export const MORPH_CONFIG = new InjectionToken<MorphConfig>('MORPH_CONFIG', {
  providedIn: 'root',
  factory: () => DEFAULT_MORPH_CONFIG,
});

/**
 * Registers global configuration for the morph instrument.
 *
 * @example
 * ```ts
 * bootstrapApplication(App, { providers: [provideMorph({ disabled: !animationsEnabled })] });
 * ```
 */
export function provideMorph(config: Partial<MorphConfig> = {}): EnvironmentProviders {
  return makeEnvironmentProviders([
    { provide: MORPH_CONFIG, useValue: { ...DEFAULT_MORPH_CONFIG, ...config } },
  ]);
}
