import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: 'login', loadComponent: () => import('./pages/login/login.component').then(m => m.LoginComponent) },
  { path: 'home', canActivate: [authGuard], loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
  { path: 'sezione/:id', canActivate: [authGuard], loadComponent: () => import('./pages/dettaglio-sezione/dettaglio-sezione.component').then(m => m.DettaglioSezioneComponent) },
  { path: 'sezione/:id/nuova-transazione', canActivate: [authGuard], loadComponent: () => import('./pages/crea-transazione/crea-transazione.component').then(m => m.CreaTransazioneComponent) },
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: '**', redirectTo: 'login' }
];