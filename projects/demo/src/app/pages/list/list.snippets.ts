import type { CodeLang } from '../../code-block/code-block';

export interface Snippet {
  title: string;
  lang: CodeLang;
  code: string;
}

const RUN_TS = `private readonly morph = inject(MorphService);
protected readonly items = signal<Item[]>(SEED);

add(): void {
  this.morph.run(() => this.items.update((list) => [newItem(), ...list]));
}

shuffle(): void {
  this.morph.run(() => this.items.update((list) => shuffled(list)));
}`;

export const LIST_NAMED_SNIPPETS: Snippet[] = [
  {
    title: 'Template',
    lang: 'angular-html',
    code: `@for (item of items(); track item.id) {
  <li [morph]="'item-' + item.id" morphClass="morph-list-item">
    {{ item.label }}
  </li>
}`,
  },
  { title: 'Component', lang: 'ts', code: RUN_TS },
];

export const LIST_AUTO_SNIPPETS: Snippet[] = [
  {
    title: 'Template (Chrome 137+)',
    lang: 'angular-html',
    code: `@for (item of items(); track item.id) {
  <li morph="auto">{{ item.label }}</li>
}`,
  },
  { title: 'Component', lang: 'ts', code: RUN_TS },
];
