import { Routes } from '@angular/router';
import { authGuard, adminGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login',    loadComponent: () => import('./pages/login/login').then(m => m.LoginComponent) },
  { path: 'register', loadComponent: () => import('./pages/register/register').then(m => m.RegisterComponent) },
  {
    path: '',
    canActivate: [authGuard],
    loadComponent: () => import('./shared/components/navbar/navbar').then(m => m.NavbarComponent),
    children: [
      { path: '',            redirectTo: 'home', pathMatch: 'full' },
      { path: 'home',        loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.DashboardComponent) },
      { path: 'balanco',     loadComponent: () => import('./pages/balanco/balanco').then(m => m.BalancoComponent) },
      { path: 'lancamentos', loadComponent: () => import('./pages/lancamentos/lancamentos').then(m => m.LancamentosComponent) },
      { path: 'entradas',    loadComponent: () => import('./pages/entradas/entradas').then(m => m.EntradasComponent) },
      { path: 'despesas',    loadComponent: () => import('./pages/despesas/despesas').then(m => m.DespesasComponent) },
      { path: 'salario',     loadComponent: () => import('./pages/salario/salario').then(m => m.SalarioComponent) },
      { path: 'admin',       canActivate: [adminGuard], loadComponent: () => import('./pages/admin/admin').then(m => m.AdminComponent) },
    ]
  },
  { path: '**', redirectTo: '/home' }
];
