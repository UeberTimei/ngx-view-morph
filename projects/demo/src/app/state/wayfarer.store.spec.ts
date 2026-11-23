import { TestBed } from '@angular/core/testing';
import { WayfarerStore } from './wayfarer.store';

describe('WayfarerStore', () => {
  let store: WayfarerStore;

  beforeEach(() => {
    store = TestBed.inject(WayfarerStore);
  });

  it("shows all 8 destinations for 'all'", () => {
    expect(store.visible().length).toBe(8);
  });

  it("keeps only beaches after setCategory('beaches')", () => {
    store.setCategory('beaches');
    expect(store.visible().length).toBeGreaterThan(1);
    expect(store.visible().every((d) => d.category === 'beaches')).toBe(true);
  });

  it('adds then removes a slug with toggleSaved', () => {
    store.toggleSaved('kyoto');
    expect(store.saved()).toEqual(['kyoto']);
    store.toggleSaved('kyoto');
    expect(store.saved()).toEqual([]);
  });

  it('returns undefined for an unknown slug', () => {
    expect(store.bySlug('nope')).toBeUndefined();
  });
});
