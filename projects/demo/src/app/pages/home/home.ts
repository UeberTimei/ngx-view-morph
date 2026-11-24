import { afterNextRender, ApplicationRef, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MorphService } from 'ngx-view-morph';

import { CATEGORIES, Category, Destination } from '../../data/destinations';
import { Hero } from '../../landing/hero/hero';
import { WayfarerStore } from '../../state/wayfarer.store';
import { DestinationTile } from './destination-tile';

@Component({
  selector: 'demo-home',
  imports: [Hero, DestinationTile],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomePage {
  protected readonly store = inject(WayfarerStore);
  protected readonly categories = CATEGORIES;
  private readonly morph = inject(MorphService);
  private readonly router = inject(Router);
  private readonly appRef = inject(ApplicationRef);

  constructor() {
    // Runs after the grid renders, still inside the route transition, so the morph lands on the tile.
    afterNextRender(() => window.scrollTo({ top: this.store.homeScrollY, behavior: 'instant' }));
  }

  selectCategory(category: Category | 'all'): void {
    this.store.activeSlug.set(null);
    this.store.reflowing.set(true);
    this.appRef.tick();
    const { finished } = this.morph.run(() => this.store.setCategory(category));
    // The promise settles for superseded and skipped transitions too, so the flag always clears.
    void finished.finally(() => this.store.reflowing.set(false));
  }

  open(destination: Destination): void {
    this.store.homeScrollY = window.scrollY;
    this.store.activeSlug.set(destination.slug);
    this.appRef.tick();
    void this.router
      .navigate(['d', destination.slug])
      .finally(() => this.store.activeSlug.set(null));
  }

  toggleSave(destination: Destination): void {
    // Drop the leftover route-morph name from a back navigation so the save name wins.
    this.store.activeSlug.set(null);
    this.store.flyingSlug.set(destination.slug);
    this.appRef.tick();
    const { finished } = this.morph.run(() => this.store.toggleSaved(destination.slug));
    void finished.finally(() => this.store.flyingSlug.set(null));
  }
}
