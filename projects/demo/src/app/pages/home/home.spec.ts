import { TestBed } from '@angular/core/testing';
import { provideRouter, Router } from '@angular/router';
import { provideMorph } from 'ngx-view-morph';

import { WayfarerStore } from '../../state/wayfarer.store';
import { HomePage } from './home';

describe('HomePage', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideMorph(), provideRouter([])],
    });
  });

  it('shows all 8 tiles, then only cities after choosing Cities', async () => {
    const fixture = TestBed.createComponent(HomePage);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelectorAll('demo-destination-tile').length).toBe(8);

    fixture.componentInstance.selectCategory('cities');
    await fixture.whenStable();
    expect(el.querySelectorAll('demo-destination-tile').length).toBe(3);
  });

  it('clears the reflow flag even after rapid repeated selection', async () => {
    const fixture = TestBed.createComponent(HomePage);
    const store = TestBed.inject(WayfarerStore);
    fixture.componentInstance.selectCategory('cities');
    fixture.componentInstance.selectCategory('beaches');
    await fixture.whenStable();
    await new Promise((r) => setTimeout(r, 50));
    expect(store.reflowing()).toBe(false);
  });

  it('names the opened photo before navigating', () => {
    const fixture = TestBed.createComponent(HomePage);
    const store = TestBed.inject(WayfarerStore);
    const navigate = vi.spyOn(TestBed.inject(Router), 'navigate').mockResolvedValue(true);
    const kyoto = store.bySlug('kyoto')!;
    fixture.componentInstance.open(kyoto);
    expect(store.activeSlug()).toBe('kyoto');
    expect(navigate).toHaveBeenCalledWith(['d', 'kyoto']);
  });
});
