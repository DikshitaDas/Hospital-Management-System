import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { AdminDashboardComponent } from './pages/admin/dashboard/admin-dashboard';
import { DoctorDashboardComponent } from './pages/doctor/dashboard/doctor-dashboard';
import { PatientDashboardComponent } from './pages/patient/dashboard/patient-dashboard';
import { DashboardShowcaseComponent } from './pages/dashboard-showcase/dashboard-showcase';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'ui-showcase', component: DashboardShowcaseComponent },
  {
    path: 'admin/dashboard',
    component: AdminDashboardComponent,
    canActivate: [authGuard, roleGuard(['ADMIN'])]
  },
  {
    path: 'doctor/dashboard',
    component: DoctorDashboardComponent,
    canActivate: [authGuard, roleGuard(['DOCTOR'])]
  },
  {
    path: 'patient/dashboard',
    component: PatientDashboardComponent,
    canActivate: [authGuard, roleGuard(['PATIENT'])]
  },
  { path: '**', redirectTo: 'login' }
];
