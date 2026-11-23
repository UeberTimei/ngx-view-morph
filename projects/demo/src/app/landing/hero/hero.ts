import { Component, signal } from '@angular/core';

const INSTALL = 'npm i ngx-view-morph';

@Component({
  selector: 'demo-hero',
  template: `
    <section class="hero">
      <p class="kicker">Shared-element transitions for Angular</p>
      <h1>Make every screen<br /><em>feel like the same place.</em></h1>
      <p class="lede">
        Everything on this page moves with <strong>ngx-view-morph</strong>. Tap a destination,
        filter the grid, save a favourite. No animation code in the components.
      </p>
      <div class="actions">
        <button class="install" type="button" (click)="copy()" aria-label="Copy install command">
          <code>${INSTALL}</code>
          <span>{{ copied() ? 'Copied' : 'Copy' }}</span>
        </button>
        <a class="link" href="https://github.com/UeberTimei/ngx-view-morph">GitHub</a>
        <a class="link" href="https://ueberTimei.github.io/ngx-view-morph/">Docs</a>
      </div>
    </section>
  `,
  styleUrl: './hero.scss',
})
export class Hero {
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    await navigator.clipboard?.writeText(INSTALL);
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1600);
  }
}
