import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MorphDirective, MorphService } from 'ngx-view-morph';

interface Item {
  id: number;
  label: string;
}

const SEED: Item[] = [
  { id: 1, label: 'Milk' },
  { id: 2, label: 'Bread' },
  { id: 3, label: 'Coffee' },
  { id: 4, label: 'Apples' },
];

@Component({
  selector: 'demo-auto',
  imports: [MatButtonModule, MatIconModule, MorphDirective],
  templateUrl: './auto.html',
  styleUrl: './auto.scss',
})
export class AutoPage {
  private readonly morph = inject(MorphService);
  private nextId = SEED.length + 1;

  protected readonly items = signal<Item[]>([...SEED]);

  /** Prepends a new item to the list. */
  protected add(): void {
    const item: Item = { id: this.nextId++, label: `Item ${this.nextId - 1}` };
    this.morph.run(() => this.items.update((rows) => [item, ...rows]));
  }

  /** Removes the item with the given id. */
  protected remove(id: number): void {
    this.morph.run(() => this.items.update((rows) => rows.filter((r) => r.id !== id)));
  }

  /** Randomly reorders the items. */
  protected shuffle(): void {
    this.morph.run(() =>
      this.items.update((rows) =>
        [...rows]
          .map((r) => ({ r, k: Math.random() }))
          .sort((a, b) => a.k - b.k)
          .map(({ r }) => r),
      ),
    );
  }
}
