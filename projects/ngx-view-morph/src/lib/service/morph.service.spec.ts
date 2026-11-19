import { DOCUMENT } from '@angular/common';
import { ApplicationRef, EnvironmentProviders, Provider } from '@angular/core';
import { TestBed } from '@angular/core/testing';

import { CoverAnimation, MorphCoverAnimator } from '../cover/morph.cover';
import { provideMorph } from '../morph.config';
import { MorphService } from './morph.service';

/** Builds a fake document with controllable VT support and reduced-motion. */
function fakeDocument(opts: {
  startViewTransition?: (cb: () => void) => unknown;
  reducedMotion?: boolean;
  rootClasses?: { add: string[]; remove: string[] };
}): Document {
  const tracked = opts.rootClasses;
  return {
    startViewTransition: opts.startViewTransition,
    documentElement: {
      classList: {
        add: (c: string) => tracked?.add.push(c),
        remove: (c: string) => tracked?.remove.push(c),
      },
    },
    defaultView: {
      matchMedia: (_query: string) => ({ matches: opts.reducedMotion ?? false }),
    },
  } as unknown as Document;
}

/** Creates a MorphService wired to the given fake document and optional extra providers. */
function setup(
  doc: Document,
  extraProviders: Array<Provider | EnvironmentProviders> = [],
): MorphService {
  TestBed.configureTestingModule({
    providers: [MorphService, { provide: DOCUMENT, useValue: doc }, ...extraProviders],
  });
  return TestBed.inject(MorphService);
}

describe('MorphService', () => {
  it('runs the callback synchronously when View Transitions are unsupported', () => {
    const service = setup(fakeDocument({ startViewTransition: undefined }));
    let ran = false;

    service.run(() => {
      ran = true;
    });

    expect(ran).toBe(true);
  });

  it('flushes change detection inside the transition callback, after the mutation', () => {
    let ran = false;
    let tickRanAfterMutation = false;
    const fakeAppRef = {
      tick: () => {
        tickRanAfterMutation = ran;
      },
    } as unknown as ApplicationRef;

    let captured: (() => void) | undefined;
    const startViewTransition = (cb: () => void) => {
      captured = cb;
      return { finished: Promise.resolve() };
    };
    const service = setup(fakeDocument({ startViewTransition }), [
      { provide: ApplicationRef, useValue: fakeAppRef },
    ]);

    service.run(() => {
      ran = true;
    });
    captured!();

    expect(ran).toBe(true);
    expect(tickRanAfterMutation).toBe(true);
  });

  it('drives the mutation through startViewTransition when supported', () => {
    let capturedCallback: (() => void) | undefined;
    const startViewTransition = (cb: () => void) => {
      capturedCallback = cb;
      return { finished: Promise.resolve() };
    };
    const service = setup(fakeDocument({ startViewTransition }));
    let ran = false;

    service.run(() => {
      ran = true;
    });

    expect(ran).toBe(false);
    expect(capturedCallback).toBeTypeOf('function');

    capturedCallback!();
    expect(ran).toBe(true);
  });

  it('skips the transition and mutates immediately when reduced motion is preferred', () => {
    let startCalled = false;
    const startViewTransition = (cb: () => void) => {
      startCalled = true;
      cb();
      return { finished: Promise.resolve() };
    };
    const service = setup(fakeDocument({ startViewTransition, reducedMotion: true }));
    let ran = false;

    service.run(() => {
      ran = true;
    });

    expect(startCalled).toBe(false);
    expect(ran).toBe(true);
  });

  it('routes focus to the focusTarget element after the transition finishes', async () => {
    const startViewTransition = (cb: () => void) => {
      cb();
      return { finished: Promise.resolve() };
    };
    const service = setup(fakeDocument({ startViewTransition }));
    let focused = false;
    const target = { focus: () => (focused = true) } as unknown as HTMLElement;

    service.run(() => {}, { focusTarget: target });

    expect(focused).toBe(false);
    await new Promise((resolve) => setTimeout(resolve));
    expect(focused).toBe(true);
  });

  it('disables the root transition for the duration of a service-driven morph', async () => {
    const rootClasses = { add: [] as string[], remove: [] as string[] };
    const startViewTransition = (cb: () => void) => {
      cb();
      return { finished: Promise.resolve() };
    };
    const service = setup(fakeDocument({ startViewTransition, rootClasses }));

    service.run(() => {});

    expect(rootClasses.add).toContain('ngx-morph-running');
    expect(rootClasses.remove).toHaveLength(0);

    await new Promise((resolve) => setTimeout(resolve));
    expect(rootClasses.remove).toContain('ngx-morph-running');
  });

  it('drives the cover animator through begin, captureNew, animate, and cleanup', async () => {
    const beats: string[] = [];
    const ready = Promise.resolve();
    let capturedReady: Promise<unknown> | undefined;
    const fakeCover: CoverAnimation = {
      captureNew: () => beats.push('captureNew'),
      animate: (r) => {
        beats.push('animate');
        capturedReady = r;
      },
      cleanup: () => beats.push('cleanup'),
    };
    const fakeAnimator = {
      begin: () => {
        beats.push('begin');
        return fakeCover;
      },
    } as unknown as MorphCoverAnimator;

    let capturedCallback: (() => void) | undefined;
    const startViewTransition = (cb: () => void) => {
      capturedCallback = cb;
      return { finished: Promise.resolve(), ready };
    };
    const fakeAppRef = { tick: () => {} } as unknown as ApplicationRef;
    const service = setup(fakeDocument({ startViewTransition }), [
      { provide: ApplicationRef, useValue: fakeAppRef },
      { provide: MorphCoverAnimator, useValue: fakeAnimator },
    ]);

    service.run(() => {});

    expect(beats).toEqual(['begin', 'animate']);
    expect(capturedReady).toBe(ready);

    capturedCallback!();
    expect(beats).toEqual(['begin', 'animate', 'captureNew']);

    await new Promise((resolve) => setTimeout(resolve));
    expect(beats).toContain('cleanup');
  });

  it('exposes a status signal that moves from running to done', async () => {
    const startViewTransition = (cb: () => void) => {
      cb();
      return { finished: Promise.resolve() };
    };
    const service = setup(fakeDocument({ startViewTransition }));

    const transition = service.run(() => {});

    expect(transition.status()).toBe('running');
    await new Promise((resolve) => setTimeout(resolve));
    expect(transition.status()).toBe('done');
  });

  it('reports a skipped status when the transition does not animate', () => {
    const service = setup(fakeDocument({ startViewTransition: undefined }));

    const transition = service.run(() => {});

    expect(transition.status()).toBe('skipped');
  });

  it('skips animation entirely when globally disabled via provideMorph', () => {
    let startCalled = false;
    const startViewTransition = (cb: () => void) => {
      startCalled = true;
      cb();
      return { finished: Promise.resolve() };
    };
    const service = setup(fakeDocument({ startViewTransition }), [
      provideMorph({ disabled: true }),
    ]);
    let ran = false;

    const transition = service.run(() => {
      ran = true;
    });

    expect(startCalled).toBe(false);
    expect(ran).toBe(true);
    expect(transition.status()).toBe('skipped');
  });
});
