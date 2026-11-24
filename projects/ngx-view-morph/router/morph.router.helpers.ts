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

/** Rectangle in viewport pixels, as returned by `getBoundingClientRect`. */
export type Box = Pick<DOMRectReadOnly, 'top' | 'right' | 'bottom' | 'left' | 'width' | 'height'>;

/** `clip-path` that cuts a photo box down to the visible frame, in percent of the photo box. */
export function windowClip(photo: Box, frame: Box, radius: string): string {
  const inset = [
    (frame.top - photo.top) / photo.height,
    (photo.right - frame.right) / photo.width,
    (photo.bottom - frame.bottom) / photo.height,
    (frame.left - photo.left) / photo.width,
  ]
    .map((fraction) => `${Math.max(0, fraction * 100)}%`)
    .join(' ');
  return `inset(${inset} round ${radius})`;
}
