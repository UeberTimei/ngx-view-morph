import { Routes } from '@angular/router';

import type { DestinationPage } from './pages/destination/destination';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Wayfarer',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'd/:slug',
    // Runs for the button, browser back and swipe alike.
    canDeactivate: [(page: DestinationPage) => page.fadeOut()],
    loadComponent: () => import('./pages/destination/destination').then((m) => m.DestinationPage),
  },
  { path: '**', redirectTo: '' },
];
