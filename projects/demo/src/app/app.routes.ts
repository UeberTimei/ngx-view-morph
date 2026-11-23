import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    title: 'Wayfarer',
    loadComponent: () => import('./pages/home/home').then((m) => m.HomePage),
  },
  {
    path: 'd/:slug',
    loadComponent: () => import('./pages/destination/destination').then((m) => m.DestinationPage),
  },
  { path: '**', redirectTo: '' },
];
