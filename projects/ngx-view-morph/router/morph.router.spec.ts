import { morphDirection } from './morph.router.helpers';

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
