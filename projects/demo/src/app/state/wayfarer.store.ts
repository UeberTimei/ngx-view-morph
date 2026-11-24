import { computed, Injectable, signal } from '@angular/core';
import { Category, DESTINATIONS, Destination } from '../data/destinations';

/** UI state for the Wayfarer demo, plus which element carries a shared morph name right now. */
@Injectable({ providedIn: 'root' })
export class WayfarerStore {
  private readonly _category = signal<Category | 'all'>('all');
  private readonly _saved = signal<string[]>([]);

  readonly category = this._category.asReadonly();
  readonly saved = this._saved.asReadonly();

  /** Slug whose photo carries the route-morph name. */
  readonly activeSlug = signal<string | null>(null);
  /** Home scroll offset at the moment a card opened, restored when coming back. */
  homeScrollY = 0;
  /** True while the grid reflows, so tiles carry list-morph names. */
  readonly reflowing = signal(false);
  /** Slug whose photo and tray thumbnail share a name while a save animates. */
  readonly flyingSlug = signal<string | null>(null);

  readonly visible = computed<Destination[]>(() => {
    const category = this._category();
    return category === 'all' ? DESTINATIONS : DESTINATIONS.filter((d) => d.category === category);
  });

  setCategory(category: Category | 'all'): void {
    this._category.set(category);
  }

  toggleSaved(slug: string): void {
    this._saved.update((list) =>
      list.includes(slug) ? list.filter((s) => s !== slug) : [...list, slug],
    );
  }

  bySlug(slug: string): Destination | undefined {
    return DESTINATIONS.find((d) => d.slug === slug);
  }
}
