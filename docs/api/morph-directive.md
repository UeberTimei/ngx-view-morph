# MorphDirective

`[morph]` is a standalone directive. It works on any element or component host.

```ts
import { MorphDirective } from 'ngx-view-morph';
```

```html
<mat-card [morph]="'card-' + id" morphClass="morph-cover">…</mat-card>
```

## Inputs

| Input | Type | Default | Description |
| --- | --- | --- | --- |
| `morph` | `string \| null` | `null` | The `view-transition-name`. Use `'auto'` to let the browser name the element (`match-element`, Chrome 137+). `null` removes the name. |
| `morphClass` | `string \| null` | `null` | Extra `view-transition-class` values, space separated. Use it to style groups of elements. |

## What it sets on the host

| Style | Value |
| --- | --- |
| `view-transition-name` | the `morph` input, or `match-element` for `'auto'` |
| `view-transition-class` | `ngx-morph`, plus `morphClass` when given |
| `border-radius` | `var(--morph-radius, 16px)`, only when `morphClass` contains `morph-cover` |

## Constants

| Name | Value | Meaning |
| --- | --- | --- |
| `MORPH_SCOPE_CLASS` | `'ngx-morph'` | On every managed element. |
| `MORPH_COVER_CLASS` | `'morph-cover'` | Opt-in class for Covers. |

## Notes

- A name must be unique within one view state. See [Shared elements](/guide/shared-elements).
- With `morph="auto"`, only the browser can name the element. Cover radius capture ignores these elements.
