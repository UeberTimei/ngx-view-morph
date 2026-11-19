/*
 * Public API Surface of ngx-view-morph
 */

export { MorphService } from './lib/service/morph.service';
export type { MorphRunOptions, MorphStatus, MorphTransition } from './lib/service/morph.service';
export {
  MorphDirective,
  MORPH_SCOPE_CLASS,
  MORPH_COVER_CLASS,
} from './lib/directive/morph.directive';
export { provideMorph, MORPH_CONFIG, DEFAULT_MORPH_CONFIG } from './lib/morph.config';
export type { MorphConfig } from './lib/morph.config';
