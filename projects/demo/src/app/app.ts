import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { Header } from './layout/header/header';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header],
  template: `
    <demo-header />
    <main tabindex="-1"><router-outlet /></main>
  `,
})
export class App {}
