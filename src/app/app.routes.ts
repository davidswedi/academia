import { APP_NAME } from './app.constants';
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    title: `Login - ${APP_NAME}`,
    path: 'login',
    loadComponent: () => import('./pages/login/login.component'),
  },
  {
    title: `${APP_NAME}`,
    path: '',
    loadComponent: () => import('./pages/home/home.component'),
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
        path: '',
        redirectTo: 'interner',
        pathMatch: 'full',
      },
    ],
  },
];
