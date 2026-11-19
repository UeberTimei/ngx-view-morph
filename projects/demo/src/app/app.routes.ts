import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'cards' },
  {
    path: 'cards',
    title: 'Cards → detail',
    loadComponent: () => import('./pages/cards/cards').then((m) => m.CardsPage),
  },
  {
    path: 'list',
    title: 'List transitions',
    loadComponent: () => import('./pages/list/list').then((m) => m.ListPage),
  },
  {
    path: 'auto',
    title: 'Auto names',
    loadComponent: () => import('./pages/auto/auto').then((m) => m.AutoPage),
  },
];
