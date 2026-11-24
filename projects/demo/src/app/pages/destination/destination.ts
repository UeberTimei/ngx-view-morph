import { Component, inject, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MorphDirective } from 'ngx-view-morph';

import { WayfarerStore } from '../../state/wayfarer.store';

@Component({
  selector: 'demo-destination',
  imports: [MorphDirective],
  templateUrl: './destination.html',
  styleUrl: './destination.scss',
})
export class DestinationPage implements OnDestroy {
  private readonly router = inject(Router);
  private readonly store = inject(WayfarerStore);

  protected readonly destination = this.store.bySlug(
    inject(ActivatedRoute).snapshot.paramMap.get('slug') ?? '',
  );

  constructor() {
    // Deep link to an unknown slug: nothing to show, go home.
    if (!this.destination) void this.router.navigateByUrl('/', { replaceUrl: true });
  }

  protected back(): void {
    void this.router.navigateByUrl('/');
  }

  ngOnDestroy(): void {
    // Runs for every way out (button, browser back, swipe), before the home tile renders.
    // The name stays set until the next HomePage action clears it.
    this.store.activeSlug.set(this.destination?.slug ?? null);
  }
}
