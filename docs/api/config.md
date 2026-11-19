# Configuration

## `provideMorph(config?)`

Registers global configuration. Call it in your application providers.

```ts
import { provideMorph } from 'ngx-view-morph';

bootstrapApplication(App, {
  providers: [provideMorph({ disabled: !animationsEnabled })],
});
```

Without it, the defaults apply.

## `MorphConfig`

| Field | Type | Default | Description |
| --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | Turns off every morph. Callbacks still run and the DOM updates at once. |

## Other exports

| Name | Description |
| --- | --- |
| `MORPH_CONFIG` | Injection token with the resolved config. Inject it to read the current values. |
| `DEFAULT_MORPH_CONFIG` | The defaults: `{ disabled: false }`. |
