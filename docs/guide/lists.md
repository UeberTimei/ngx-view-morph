# Lists

Adding, removing and reordering list items animates with the same `MorphService.run`. There are two ways to name the rows.

## Named rows

Give every row its own name and the same `morphClass`:

```html
@for (item of items(); track item.id) {
<li [morph]="'item-' + item.id" morphClass="morph-list-item">{{ item.label }}</li>
}
```

```ts
add(): void {
  this.morph.run(() => this.items.update((list) => [newItem(), ...list]));
}

remove(id: number): void {
  this.morph.run(() => this.items.update((list) => list.filter((i) => i.id !== id)));
}

shuffle(): void {
  this.morph.run(() => this.items.update((list) => shuffled(list)));
}
```

Rows that stay slide to their new place. A new row fades and rises in, and a removed row fades and sinks out. That comes from the `morph-list-item` class in the default stylesheet.

Use a stable `track` key so Angular keeps the same element for the same item.

## Auto-named rows

If you do not want to invent ids, let the browser name each element:

```html
@for (item of items(); track item.id) {
<li morph="auto">{{ item.label }}</li>
}
```

`morph="auto"` sets `view-transition-name: match-element`. The browser then identifies each element by itself. It needs Chrome 137 or newer. In other browsers the rows are not individually morphed, and the update is still applied.

| | Named | Auto |
| --- | --- | --- |
| You write | a unique name per row | nothing |
| Works in | every browser with View Transitions | Chrome 137+ |
| Use for | shared elements across views | lists inside one view |

## Group styling

Every row carries the class you pass in `morphClass`, so you can restyle all of them in one rule:

```css
::view-transition-group(.morph-list-item) {
  animation-duration: 500ms;
}
```
