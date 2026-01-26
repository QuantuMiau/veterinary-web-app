import { Routes } from '@angular/router';
import {LoginComponent} from './pages/login.component/login.component';
import {AuthLayoutComponent} from './layouts/auth-layout.component/auth-layout.component';
import {MainLayoutComponent} from './layouts/main-layout.component/main-layout.component';
import {DashboardComponent} from './pages/dashboard.component/dashboard.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent }
    ]
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [{ path: 'dashboard', component: DashboardComponent}]
  }
];
