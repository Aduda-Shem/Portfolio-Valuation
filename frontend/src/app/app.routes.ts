import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/portfolio-list/portfolio-list.component').then(m => m.PortfolioListComponent),
  },
  {
    path: 'portfolios/:id',
    loadComponent: () => import('./pages/portfolio-detail/portfolio-detail.component').then(m => m.PortfolioDetailComponent),
  },
  {
    path: 'holdings',
    loadComponent: () => import('./pages/holdings-list/holdings-list.component').then(m => m.HoldingsListComponent),
  },
  {
    path: 'valuations',
    loadComponent: () => import('./pages/valuations-list/valuations-list.component').then(m => m.ValuationsListComponent),
  },
  {
    path: '**',
    redirectTo: '',
  },
];

