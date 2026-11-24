import { ViewTransitionInfo } from '@angular/router';

/**
 * Route morph for photos whose frames crop them differently (tile vs hero).
 *
 * The named `<img>` is the whole uncropped photo, so the old and new snapshots show the same
 * picture and crossfade invisibly. Browsers don't clip a snapshot to its ancestors' overflow, so
 * this animates a clip-path on the transition group from the old frame to the new one.
 */
export function animateCoverWindows({ transition }: ViewTransitionInfo): void {
  const before = measureWindows();
  void transition.ready.then(() => {
    const after = measureWindows();
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const duration = parseFloat(style.getPropertyValue('--morph-duration')) || 0;
    const ms = style.getPropertyValue('--morph-duration').trim().endsWith('ms')
      ? duration
      : duration * 1000;
    const easing = style.getPropertyValue('--morph-easing').trim() || 'ease';

    for (const [name, from] of before) {
      const to = after.get(name);
      if (!to) continue;
      root.animate(
        { clipPath: [from, to] },
        { duration: ms, easing, fill: 'both', pseudoElement: `::view-transition-group(${CSS.escape(name)})` },
      );
    }
  });
}

/** Maps each named cover photo to the clip-path of its frame, relative to the photo's own box. */
function measureWindows(): Map<string, string> {
  const windows = new Map<string, string>();
  for (const img of document.querySelectorAll<HTMLElement>('img[style*="morph-cover"]')) {
    const name = img.style.getPropertyValue('view-transition-name');
    const frame = img.parentElement;
    if (!name || name === 'none' || !frame) continue;

    const photo = img.getBoundingClientRect();
    const view = frame.getBoundingClientRect();
    const inset = [
      (view.top - photo.top) / photo.height,
      (photo.right - view.right) / photo.width,
      (photo.bottom - view.bottom) / photo.height,
      (view.left - photo.left) / photo.width,
    ]
      .map((fraction) => `${Math.max(0, fraction * 100)}%`)
      .join(' ');
    const radius = getComputedStyle(frame).borderTopLeftRadius;
    windows.set(name, `inset(${inset} round ${radius})`);
  }
  return windows;
}
