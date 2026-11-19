import { MorphDirection } from './morph.router.types';

/** Counts non-empty path segments, ignoring query string and hash. */
export function depth(url: string): number {
  const path = url.split(/[?#]/)[0];
  return path.split('/').filter(Boolean).length;
}

/**
 * Returns `'backward'` when the target URL is shallower than the source URL,
 * otherwise `'forward'` (equal depth counts as forward).
 */
export function morphDirection(fromUrl: string, toUrl: string): MorphDirection {
  return depth(toUrl) < depth(fromUrl) ? 'backward' : 'forward';
}
