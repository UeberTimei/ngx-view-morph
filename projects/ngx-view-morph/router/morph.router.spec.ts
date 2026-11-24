import { morphDirection, windowClip } from './morph.router.helpers';

describe('morphDirection', () => {
  it('is "forward" when navigating to a deeper URL', () => {
    expect(morphDirection('/products', '/products/42')).toBe('forward');
  });

  it('is "backward" when navigating to a shallower URL', () => {
    expect(morphDirection('/products/42', '/products')).toBe('backward');
  });

  it('defaults to "forward" for sibling navigations of equal depth', () => {
    expect(morphDirection('/products/42', '/products/99')).toBe('forward');
  });

  it('ignores empty segments and query/hash noise', () => {
    expect(morphDirection('/products/', '/products/42?ref=x')).toBe('forward');
  });
});

describe('windowClip', () => {
  const box = (left: number, top: number, width: number, height: number) => ({
    left,
    top,
    width,
    height,
    right: left + width,
    bottom: top + height,
  });

  it('insets a photo box down to the frame, in percent of the photo', () => {
    const clip = windowClip(box(0, -100, 200, 400), box(0, 0, 200, 200), '8px');
    expect(clip).toBe('inset(25% 0% 25% 0% round 8px)');
  });

  it('never goes negative when the frame sticks out of the photo', () => {
    expect(windowClip(box(10, 10, 100, 100), box(0, 0, 200, 200), '0px')).toBe(
      'inset(0% 0% 0% 0% round 0px)',
    );
  });
});
