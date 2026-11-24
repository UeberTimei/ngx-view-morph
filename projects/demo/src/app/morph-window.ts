import { ViewTransitionInfo } from '@angular/router';

/**
 * Route morph for photos whose frames crop them differently (tile vs hero).
 *
 * The named `<img>` is the whole uncropped photo, so the old and new snapshots show the same
 * picture and crossfade invisibly. Browsers don't clip a snapshot to its ancestors' overflow, so
 * this animates a clip-path on the transition group from the old frame to the new one.
 */
export function animateCoverWindows({ transition }: ViewTransitionInfo): void {
  // A backdrop-filter on a named element leaks its glass over the whole transition layer.
  document.documentElement.classList.add('vt-active');
  void transition.finished.finally(() => document.documentElement.classList.remove('vt-active'));
  const before = measureWindows();
  // A clip set only at `ready` leaves the full photo box visible until then, so it applies from the first frame.
  const rules = document.createElement('style');
  for (const [name, from] of before) {
    rules.textContent += `::view-transition-group(${CSS.escape(name)}) { clip-path: ${from.clip}; }`;
  }
  document.head.append(rules);
  void transition.finished.finally(() => rules.remove());

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
      const group = `::view-transition-group(${CSS.escape(name)})`;
      const clip = root.animate({ clipPath: [from.clip, to.clip] }, { duration: ms, easing, fill: 'both', pseudoElement: group });
      // Start on the same frame as the browser's own group animation so the two never drift apart.
      const own = document.getAnimations().find((a) => (a.effect as KeyframeEffect | null)?.pseudoElement === group && a !== clip);
      if (own?.startTime != null) clip.startTime = own.startTime;
    }
  });
}

interface Window {
  clip: string;
}

/** Maps each named cover photo to the clip-path of its frame, relative to the photo's own box. */
function measureWindows(): Map<string, Window> {
  const windows = new Map<string, Window>();
  for (const img of document.querySelectorAll<HTMLElement>('[style*="morph-cover"][style*="--photo-ratio"]')) {
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
    windows.set(name, { clip: `inset(${inset} round ${radius})` });
  }
  return windows;
}
