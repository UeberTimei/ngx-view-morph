---
layout: home
hero:
  name: ngx-view-morph
  text: Shared-element morphs for Angular
  tagline: Wrap a state change in one call and let the View Transition API animate it. No animation code.
  actions:
    - theme: brand
      text: Get started
      link: /guide/getting-started
    - theme: alt
      text: API reference
      link: /api/morph-service
features:
  - title: One call
    details: Wrap any DOM change in MorphService.run and it animates. Sync or async.
  - title: Name it or not
    details: Give elements the same [morph] name, or use morph="auto" and let the browser name them (Chrome 137+).
  - title: Safe by default
    details: Falls back to an instant update when the browser has no View Transitions or the user prefers reduced motion.
---
