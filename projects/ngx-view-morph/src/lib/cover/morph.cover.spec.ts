import { DOCUMENT } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { vi } from 'vite-plus/test';

import { MorphCoverAnimator } from './morph.cover';

/** A Cover element: a view-transition group opted into `morph-cover`. */
function coverElement(radius: string): HTMLElement {
  const element = document.createElement('div');
  element.style.setProperty('view-transition-name', 'card-hero');
  element.style.setProperty('view-transition-class', 'ngx-morph morph-cover');
  element.style.borderTopLeftRadius = radius;
  element.style.borderTopRightRadius = radius;
  element.style.borderBottomRightRadius = radius;
  element.style.borderBottomLeftRadius = radius;
  return element;
}

function fallbackStyle(): HTMLStyleElement | null {
  return document.head.querySelector<HTMLStyleElement>('style[data-ngx-morph-transition-styles]');
}

function animator(): MorphCoverAnimator {
  TestBed.configureTestingModule({
    providers: [MorphCoverAnimator, { provide: DOCUMENT, useValue: document }],
  });
  return TestBed.inject(MorphCoverAnimator);
}

describe('MorphCoverAnimator', () => {
  it('renders a fallback style for the old Cover radii when a Cover animation begins', () => {
    const element = coverElement('12px');
    document.body.appendChild(element);

    animator().begin();

    const style = fallbackStyle();
    expect(style?.textContent).toContain('::view-transition-group(card-hero)');
    expect(style?.textContent).toContain('border-top-left-radius: 12px');

    element.remove();
    style?.remove();
  });

  it('animates the Cover group radius between the old and new captured states', async () => {
    const originalAnimate = Reflect.get(document.documentElement, 'animate');
    const animate = vi.fn(() => ({ cancel: vi.fn() }) as unknown as Animation);
    Object.defineProperty(document.documentElement, 'animate', {
      configurable: true,
      value: animate,
    });
    const element = coverElement('12px');
    document.body.appendChild(element);

    const cover = animator().begin();
    element.style.borderTopLeftRadius = '24px';
    element.style.borderTopRightRadius = '24px';
    element.style.borderBottomRightRadius = '24px';
    element.style.borderBottomLeftRadius = '24px';
    cover.captureNew();
    cover.animate(Promise.resolve());
    await Promise.resolve();

    expect(animate).toHaveBeenCalledWith(
      [
        {
          borderTopLeftRadius: '12px',
          borderTopRightRadius: '12px',
          borderBottomRightRadius: '12px',
          borderBottomLeftRadius: '12px',
        },
        {
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          borderBottomRightRadius: '24px',
          borderBottomLeftRadius: '24px',
        },
      ],
      {
        duration: 300,
        easing: 'cubic-bezier(0.2, 0, 0, 1)',
        fill: 'both',
        pseudoElement: '::view-transition-group(card-hero)',
      },
    );

    cover.cleanup();
    element.remove();
    Object.defineProperty(document.documentElement, 'animate', {
      configurable: true,
      value: originalAnimate,
    });
  });

  it('removes the fallback style on cleanup', () => {
    const element = coverElement('12px');
    document.body.appendChild(element);

    const cover = animator().begin();
    expect(fallbackStyle()?.isConnected).toBe(true);

    cover.cleanup();

    expect(fallbackStyle()).toBeNull();
    element.remove();
  });
});
