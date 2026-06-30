/** Global configuration for the morph instrument. */
export interface MorphConfig {
  /**
   * Globally disables all morph animations. Mutations still apply immediately.
   * Useful for SSR, tests, or low-power/accessibility modes.
   */
  disabled: boolean;
}
