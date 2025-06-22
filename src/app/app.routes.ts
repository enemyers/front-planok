import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { LoginComponent } from './features/auth/login/login.component';
import { TestComponent } from './test-component/test.component';
import { SimpleLoginComponent } from './features/auth/simple-login/simple-login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login',
    pathMatch: 'full'
  },
  {
    path: 'test',
    component: TestComponent
  },
  {
    path: 'simple-login',
    component: SimpleLoginComponent
  },
  {
    path: 'auth/login',
    component: LoginComponent
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(c => c.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/projects/new',
    loadComponent: () => import('./features/dashboard/project-form/project-form.component').then(c => c.ProjectFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/projects/:id',
    loadComponent: () => import('./features/dashboard/project-detail/project-detail.component').then(c => c.ProjectDetailComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/projects/edit/:id',
    loadComponent: () => import('./features/dashboard/project-form/project-form.component').then(c => c.ProjectFormComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'dashboard/notification-test',
    loadComponent: () => import('./features/dashboard/notification-test/notification-test.component').then(c => c.NotificationTestComponent),
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
