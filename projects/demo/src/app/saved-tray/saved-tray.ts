import { Component, computed, inject } from '@angular/core';
import { MorphDirective } from 'ngx-view-morph';

import { WayfarerStore } from '../state/wayfarer.store';

/** Header tray listing saved destinations; the newest thumbnail receives the flying heart photo. */
@Component({
  selector: 'demo-saved-tray',
  imports: [MorphDirective],
  template: `
    <div class="tray" aria-live="polite">
      @for (d of items(); track d.slug) {
        <img
          class="thumb"
          [src]="d.photo"
          [alt]="d.title + ' saved'"
          [morph]="store.flyingSlug() === d.slug ? 'saved-' + d.slug : null"
          morphClass="morph-cover"
        />
      } @empty {
        <span class="empty">Nothing saved yet</span>
      }
    </div>
  `,
  styles: `
    .tray {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      min-height: 2.5rem;
    }
    .thumb {
      width: 2.5rem;
      height: 2.5rem;
      object-fit: cover;
      border: 2px solid var(--paper);
      margin-left: -0.9rem;
      box-shadow: 0 0 0 1px var(--line);
    }
    .thumb:first-child {
      margin-left: 0;
    }
    .empty {
      font-size: 0.85rem;
      color: var(--ink-soft);
    }
  `,
})
export class SavedTray {
  protected readonly store = inject(WayfarerStore);
  protected readonly items = computed(() =>
    this.store
      .saved()
      .map((slug) => this.store.bySlug(slug))
      .filter((d) => !!d),
  );
}
