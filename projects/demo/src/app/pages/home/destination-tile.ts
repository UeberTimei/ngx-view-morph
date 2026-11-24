import { Component, computed, inject, input, output } from '@angular/core';
import { MorphDirective } from 'ngx-view-morph';

import { Destination } from '../../data/destinations';
import { WayfarerStore } from '../../state/wayfarer.store';

/** One photo tile. Names are bound only while an animation needs them, so no stale shared names linger. */
@Component({
  selector: 'demo-destination-tile',
  imports: [MorphDirective],
  template: `
    <article class="tile" [morph]="tileName()" morphClass="morph-list-item">
      <button class="open" type="button" (click)="opened.emit(destination())">
        <span class="frame" [morph]="flyName()" morphClass="morph-cover">
          <img
            [src]="destination().photo"
            [alt]="destination().title + ', ' + destination().place"
            [style.--photo-ratio]="destination().ratio"
            [morph]="routeName()"
            morphClass="morph-cover"
          />
        </span>
        <span class="caption">
          <strong>{{ destination().title }}</strong>
          <small>{{ destination().place }}</small>
        </span>
      </button>
      <button
        class="heart"
        type="button"
        [attr.aria-pressed]="isSaved()"
        [attr.aria-label]="(isSaved() ? 'Remove ' : 'Save ') + destination().title"
        (click)="toggled.emit(destination())"
      >
        {{ isSaved() ? '♥' : '♡' }}
      </button>
    </article>
  `,
  styleUrl: './destination-tile.scss',
})
export class DestinationTile {
  private readonly store = inject(WayfarerStore);

  readonly destination = input.required<Destination>();
  readonly opened = output<Destination>();
  readonly toggled = output<Destination>();

  protected readonly isSaved = computed(() => this.store.saved().includes(this.destination().slug));
  protected readonly tileName = computed(() =>
    this.store.reflowing() ? 'tile-' + this.destination().slug : null,
  );
  // The route morph names the whole uncropped photo (see morph-window.ts); the save flight names the cropped frame.
  protected readonly routeName = computed(() => {
    const slug = this.destination().slug;
    return this.store.activeSlug() === slug ? 'dest-' + slug : null;
  });
  protected readonly flyName = computed(() => {
    const slug = this.destination().slug;
    return this.store.flyingSlug() === slug ? 'saved-' + slug : null;
  });
}
