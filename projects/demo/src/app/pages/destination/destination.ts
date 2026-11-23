import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MorphDirective } from 'ngx-view-morph';

import { WayfarerStore } from '../../state/wayfarer.store';

@Component({
  selector: 'demo-destination',
  imports: [MorphDirective],
  templateUrl: './destination.html',
  styleUrl: './destination.scss',
})
export class DestinationPage {
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
    // The home tile must carry the shared name when it renders, so the photo morphs back.
    this.store.activeSlug.set(this.destination?.slug ?? null);
    void this.router.navigateByUrl('/').finally(() => this.store.activeSlug.set(null));
  }
}
