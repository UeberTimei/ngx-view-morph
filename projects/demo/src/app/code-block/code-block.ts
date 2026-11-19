import { Component, ViewEncapsulation, inject, input, resource, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

export type CodeLang = 'ts' | 'angular-html';

/** Collapsible, syntax-highlighted code sample with a copy-to-clipboard button. */
@Component({
  selector: 'demo-code-block',
  imports: [MatIconButton, MatIconModule],
  templateUrl: './code-block.html',
  styleUrl: './code-block.scss',
  encapsulation: ViewEncapsulation.None, // Shiki output is injected HTML, so scoped styles would not reach it
})
export class CodeBlock {
  private readonly sanitizer = inject(DomSanitizer);

  readonly title = input('View code');
  readonly code = input.required<string>();
  readonly lang = input<CodeLang>('ts');
  protected readonly copied = signal(false);

  /** Highlighted HTML; the samples are our own constants, so trusting the output is safe. */
  protected readonly html = resource<SafeHtml, { code: string; lang: CodeLang }>({
    params: () => ({ code: this.code(), lang: this.lang() }),
    loader: async ({ params }) => {
      const { codeToHtml } = await import('shiki');
      const html = await codeToHtml(params.code, { lang: params.lang, theme: 'github-dark' });

      return this.sanitizer.bypassSecurityTrustHtml(html);
    },
  });

  protected async copy(): Promise<void> {
    await navigator.clipboard.writeText(this.code());
    this.copied.set(true);
    setTimeout(() => this.copied.set(false), 1500);
  }
}
