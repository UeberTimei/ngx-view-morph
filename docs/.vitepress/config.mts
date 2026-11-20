import { defineConfig } from 'vitepress';

// DOCS_BASE lets CI serve the site from a sub-path (e.g. /ngx-view-morph/).
export default defineConfig({
  title: 'ngx-view-morph',
  description: 'Shared-element morph transitions for Angular, built on the View Transition API.',
  base: process.env['DOCS_BASE'] ?? '/',
  cleanUrls: true,
  themeConfig: {
    search: { provider: 'local' },
    nav: [
      { text: 'Guide', link: '/guide/getting-started' },
      { text: 'API', link: '/api/morph-service' },
      // _self: full page load, the demo is a separate app VitePress can't route to
      { text: 'Demo', link: '/demo/', target: '_self' },
    ],
    sidebar: [
      {
        text: 'Guide',
        items: [
          { text: 'Getting started', link: '/guide/getting-started' },
          { text: 'Concepts', link: '/guide/concepts' },
          { text: 'Shared elements', link: '/guide/shared-elements' },
          { text: 'Lists', link: '/guide/lists' },
          { text: 'Page transitions', link: '/guide/page-transitions' },
          { text: 'Styling', link: '/guide/styling' },
          { text: 'Accessibility', link: '/guide/accessibility' },
          { text: 'Browser support', link: '/guide/browser-support' },
        ],
      },
      {
        text: 'API',
        items: [
          { text: 'MorphService', link: '/api/morph-service' },
          { text: 'MorphDirective', link: '/api/morph-directive' },
          { text: 'Configuration', link: '/api/config' },
          { text: 'Router', link: '/api/router' },
        ],
      },
    ],
    outline: 'deep',
  },
});
