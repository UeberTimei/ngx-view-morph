import { Component } from '@angular/core';

@Component({
  selector: 'demo-hero',
  template: `
    <section class="hero">
      <p class="kicker">Shared-element transitions for Angular</p>
      <h1>Make every screen feel like the same place.</h1>
      <p class="lede">
        Everything on this page moves with <strong>ngx-view-morph</strong>. Tap a destination,
        filter the grid, save a favourite. No animation code in the components.
      </p>
      <div class="actions">
        <a class="link" href="https://github.com/UeberTimei/ngx-view-morph">GitHub</a>
        <a class="link" href="https://ueberTimei.github.io/ngx-view-morph/">Docs</a>
      </div>
    </section>
  `,
  styleUrl: './hero.scss',
})
export class Hero {}
