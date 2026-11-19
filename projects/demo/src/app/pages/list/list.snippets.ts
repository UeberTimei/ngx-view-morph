export const LIST_NAMED_SNIPPET = `// template: explicit name per row
@for (item of items(); track item.id) {
  <li [morph]="'item-' + item.id" morphClass="morph-list-item">
    {{ item.label }}
  </li>
}

// component: wrap every list change in MorphService.run
private readonly morph = inject(MorphService);

add() {
  this.morph.run(() => this.items.update((list) => [newItem(), ...list]));
}`;

export const LIST_AUTO_SNIPPET = `// template: no ids, the browser names each row (Chrome 137+)
@for (item of items(); track item.id) {
  <li morph="auto">{{ item.label }}</li>
}

// component: same MorphService.run as the named list
this.morph.run(() => this.items.update((list) => shuffle(list)));`;
