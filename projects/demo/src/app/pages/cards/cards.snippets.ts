export const CARDS_SNIPPET = `// template: the same shared name on the card swatch and on the detail hero
<div [morph]="morphingId() === card.id ? 'hero' : null"
     morphClass="morph-cover"></div>

<div class="detail-hero" morph="hero" morphClass="morph-cover"></div>

// component: name the clicked card first, then switch the view inside run()
open(card: Card) {
  this.morphingId.set(card.id);
  this.appRef.tick();
  this.morph.run(() => this.selected.set(card), { focusTarget: '#detail-heading' });
}

// the callback may be async: the old view stays until it resolves
this.morph.run(async () => {
  const detail = await this.api.load(card.id);
  this.selected.set(detail);
});`;
