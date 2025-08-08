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
        title: `Departement- ${APP_NAME}`,
        path: 'departement',
        loadComponent: () =>
          import('./pages/home/departement/departement.component'),
      },
      {
        path: '',
        redirectTo: 'interner',
        pathMatch: 'full',
      },
    ],
  },
];
