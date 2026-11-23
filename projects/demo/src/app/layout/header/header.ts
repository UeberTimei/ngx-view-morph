import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SavedTray } from '../../saved-tray/saved-tray';

@Component({
  selector: 'demo-header',
  imports: [RouterLink, SavedTray],
  template: `
    <header class="bar">
      <a class="brand" routerLink="/" aria-label="Wayfarer home">Wayfarer</a>
      <demo-saved-tray />
    </header>
  `,
  styles: `
    .bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.1rem var(--page-pad);
    }
    .brand {
      font-family: var(--font-display);
      font-size: 1.5rem;
      letter-spacing: -0.02em;
      text-decoration: none;
    }
  `,
})
export class Header {}
