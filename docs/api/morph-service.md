# MorphService

Injectable root service. It wraps `document.startViewTransition` with Angular change detection and a safe fallback.

```ts
import { MorphService } from 'ngx-view-morph';

private readonly morph = inject(MorphService);
```

## `run(callback, options?)`

```ts
run(callback: () => void | Promise<void>, options?: MorphRunOptions): MorphTransition
```

1. Captures the old state.
2. Awaits `callback()`.
3. Flushes Angular change detection, so the new DOM is ready for the new snapshot.
4. Lets the browser animate between the two.

The callback may be async. The morph waits for it, so you can fetch first and animate when the data arrives:

```ts
this.morph.run(async () => {
  this.item.set(await this.api.load(id));
});
```

::: warning
While the callback is pending, the old snapshot stays frozen and the page does not respond to input. Keep async callbacks short.
:::

If another morph is running, it is skipped (`skipTransition`) and the new one takes over.

### Fallback

If `disabled` is set, or the browser has no View Transitions, the callback runs at once, `status` is `skipped`, and `finished` resolves. With an async callback, focus moves before the callback finishes on this path.

## `MorphRunOptions`

| Field | Type | Description |
| --- | --- | --- |
| `focusTarget` | `HTMLElement \| string \| null` | Element, or selector, to focus when the transition ends. |

## `MorphTransition`

| Field | Type | Description |
| --- | --- | --- |
| `status` | `Signal<MorphStatus>` | Reactive status. |
| `finished` | `Promise<void>` | Resolves when the transition, or its fallback, is complete. |

## `MorphStatus`

`'running' | 'done' | 'skipped'`

```ts
const t = this.morph.run(() => this.open.set(true));

effect(() => console.log(t.status())); // running → done
await t.finished;
```
