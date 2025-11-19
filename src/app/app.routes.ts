import { APP_NAME } from './app.constants';
import { Routes } from '@angular/router';
import {
  canActivate,
  redirectLoggedInTo,
  redirectUnauthorizedTo,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['']);
export const routes: Routes = [
  {
    title: `Login - ${APP_NAME}`,
    path: 'login',
    loadComponent: () => import('./pages/login/login.component'),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    title: `${APP_NAME}`,
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
    ...canActivate(redirectUnauthorizedToLogin),
    children: [
      {
        title: `Tableau de bord`,
        path: 'dashboard',
        loadComponent: () =>
          import('./pages/home/dashboard/dashboard.component'),
      },
      {
        title: `Stagiaire - ${APP_NAME}`,
        path: 'interner',
        loadComponent: () => import('./pages/home/interner/interner.component'),
      },
      {
        title: `Stage - ${APP_NAME}`,
        path: 'internship',
        loadComponent: () =>
          import('./pages/home/internship/internship.component'),
      },
      {
        title: `Superviseur- ${APP_NAME}`,
        path: 'supervisor',
        loadComponent: () =>
          import('./pages/home/supervisor/supervisor.component'),
      },
      {
        title: `Payment- ${APP_NAME}`,
        path: 'payment',
        loadComponent: () => import('./pages/home/payment/payment.component'),
      },
      {
        title: `Modules- ${APP_NAME}`,
        path: 'modules',
        loadComponent: () =>
          import('./pages/home/learningmodules/learningmodules.component'),
      },
      {
        path: '',
        redirectTo: 'interner',
        pathMatch: 'full',
      },
    ],
  },
];
