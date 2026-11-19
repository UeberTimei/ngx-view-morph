import { Component, input, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

/** Collapsible code sample with a copy-to-clipboard button. */
@Component({
  selector: 'demo-code-block',
  imports: [MatIconButton, MatIconModule],
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
})
export class CodeBlock {
  readonly title = input('View code');
  readonly code = input.required<string>();
  protected readonly copied = signal(false);

  protected async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
