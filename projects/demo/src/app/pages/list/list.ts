import { Component, WritableSignal, inject, signal } from '@angular/core';
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
  selector: 'demo-list',
  imports: [MatButtonModule, MatIconModule, MorphDirective],
  templateUrl: './list.html',
  styleUrl: './list.scss',
})
export class ListPage {
  private readonly morph = inject(MorphService);
  private nextId = SEED.length + 1;

  protected readonly named = signal<Item[]>([...SEED]);
  protected readonly auto = signal<Item[]>([...SEED]);

  /** Prepends a new item to both lists in one morph. */
  protected add(): void {
    const item: Item = { id: this.nextId++, label: `Item ${this.nextId - 1}` };
    this.morph.run(() => {
      this.named.update((rows) => [item, ...rows]);
      this.auto.update((rows) => [item, ...rows]);
    });
  }

  /** Removes the item from one list only. */
  protected remove(list: WritableSignal<Item[]>, id: number): void {
    this.morph.run(() => list.update((rows) => rows.filter((r) => r.id !== id)));
  }

  /** Randomly reorders both lists in one morph. */
  protected shuffle(): void {
    this.morph.run(() => {
      this.named.update(shuffled);
      this.auto.update(shuffled);
    });
  }
}

function shuffled(rows: Item[]): Item[] {
  return rows
    .map((r) => ({ r, k: Math.random() }))
    .sort((a, b) => a.k - b.k)
    .map(({ r }) => r);
}
