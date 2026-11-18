import { ApplicationRef, Component, DOCUMENT, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MorphDirective, MorphService } from 'ngx-view-morph';

interface DemoCard {
  id: number;
  title: string;
  color: string;
  body: string;
}

const CARDS: DemoCard[] = [
  { id: 1, title: 'Aurora', color: '#7c3aed', body: 'Northern lights over the tundra.' },
  { id: 2, title: 'Coral', color: '#ef4444', body: 'Reef gardens of warm seas.' },
  { id: 3, title: 'Meadow', color: '#10b981', body: 'Meadows after summer rain.' },
  { id: 4, title: 'Dune', color: '#f59e0b', body: 'Dunes at sunset.' },
];

const HERO = 'card-hero';
const HERO_TITLE = 'card-hero-title';

@Component({
  selector: 'demo-cards',
  imports: [MatCardModule, MatButtonModule, MorphDirective],
  templateUrl: './cards.html',
  styleUrl: './cards.scss',
})
export class CardsPage {
  private readonly morph = inject(MorphService);
  private readonly appRef = inject(ApplicationRef);
  private readonly doc = inject(DOCUMENT);

  protected readonly hero = HERO;
  protected readonly heroTitle = HERO_TITLE;
  protected readonly cards = CARDS;
  protected readonly selected = signal<DemoCard | null>(null);
  /** Id of the card that should carry the shared transition name right now. */
  protected readonly morphingId = signal<number | null>(null);

  /** Opens the detail view for a card, morphing its swatch and title into the hero. */
  protected open(card: DemoCard): void {
    // 1) Tag the clicked swatch/title with the shared name and flush, so the
    //    name is on the DOM before the old snapshot is captured.
    this.morphingId.set(card.id);
    this.appRef.tick();
    // 2) Switch to the detail view; the hero/title carry the same shared name,
    //    so the swatch morphs smoothly into the hero.
    this.morph.run(() => this.selected.set(card), { focusTarget: '#detail-heading' });
  }

  /** Returns to the card grid, morphing the hero back into the originating swatch. */
  protected close(): void {
    const id = this.morphingId();
    const transition = this.morph.run(() => this.selected.set(null), {
      focusTarget: id ? this.doc.getElementById(`card-${id}`) : null,
    });
    // Drop the shared name only after the morph-back completes.
    void transition.finished.finally(() => this.morphingId.set(null));
  }
}
