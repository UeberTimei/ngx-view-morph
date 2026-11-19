import type { Snippet } from '../list/list.snippets';

export const CARDS_SNIPPETS: Snippet[] = [
  {
    title: 'Template',
    lang: 'angular-html',
    code: `<!-- the same shared name on the card swatch and on the detail hero -->
<div [morph]="morphingId() === card.id ? 'hero' : null" morphClass="morph-cover"></div>

<div class="detail-hero" morph="hero" morphClass="morph-cover"></div>`,
  },
  {
    title: 'Component',
    lang: 'ts',
    code: `// name the clicked card first, then switch the view inside run()
open(card: Card): void {
  this.morphingId.set(card.id);
  this.appRef.tick();
  this.morph.run(() => this.selected.set(card), { focusTarget: '#detail-heading' });
}

// the callback may be async: the old view stays until it resolves
this.morph.run(async () => {
  const detail = await this.api.load(card.id);
  this.selected.set(detail);
});`,
  },
];
