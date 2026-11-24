import { windowClip } from './morph.router.helpers';

/** Attribute set by `MorphDirective` when `morphWindow` is on. */
const WINDOW_SELECTOR = '[data-morph-window]';

interface PhotoWindow {
  clip: string;
}

/**
 * Makes a photo that two screens crop differently morph as one picture.
 *
 * The element marked with `morphWindow` is the whole uncropped photo, so its old and new
 * snapshots show the same image. Browsers do not clip a snapshot to the overflow of its
 * ancestors, so this animates a `clip-path` on the transition group from the old frame
 * to the new one. The first clip lands before the first frame; the animation starts on the same
 * frame as the browser's own group animation, so the two never drift apart.
 */
export function animateMorphWindows(transition: ViewTransition): void {
  const before = measure();
  if (before.size === 0) return;

  const rules = document.createElement('style');
  for (const [name, from] of before) {
    rules.textContent += `::view-transition-group(${CSS.escape(name)}) { clip-path: ${from.clip}; }`;
  }
  document.head.append(rules);
  void transition.finished.finally(() => rules.remove());

  void transition.ready.then(() => {
    const after = measure();
    const root = document.documentElement;
    const style = getComputedStyle(root);
    const raw = style.getPropertyValue('--morph-duration').trim();
    const duration = (parseFloat(raw) || 0) * (raw.endsWith('ms') ? 1 : 1000);
    const easing = style.getPropertyValue('--morph-easing').trim() || 'ease';

    for (const [name, from] of before) {
      const to = after.get(name);
      if (!to) continue;
      const pseudoElement = `::view-transition-group(${CSS.escape(name)})`;
      const clip = root.animate(
        { clipPath: [from.clip, to.clip] },
        { duration, easing, fill: 'both', pseudoElement },
      );
      const own = document
        .getAnimations()
        .find((a) => a !== clip && (a.effect as KeyframeEffect | null)?.pseudoElement === pseudoElement);
      if (own?.startTime != null) clip.startTime = own.startTime;
    }
  });
}

/** Maps each marked, named photo to the clip-path of its frame (the parent element). */
function measure(): Map<string, PhotoWindow> {
  const windows = new Map<string, PhotoWindow>();
  for (const photo of document.querySelectorAll<HTMLElement>(WINDOW_SELECTOR)) {
    const name = photo.style.getPropertyValue('view-transition-name');
    const frame = photo.parentElement;
    if (!name || name === 'none' || !frame) continue;
    const radius = getComputedStyle(frame).borderTopLeftRadius;
    windows.set(name, {
      clip: windowClip(photo.getBoundingClientRect(), frame.getBoundingClientRect(), radius),
    });
  }
  return windows;
}
