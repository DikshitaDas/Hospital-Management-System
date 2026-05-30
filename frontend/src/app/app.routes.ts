import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';
import { adminRoutes } from './admin/admin.routes';
import { LoginComponent } from './pages/login/login';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password';
import { RegisterComponent } from './pages/register/register';
import { DoctorDashboardComponent } from './pages/doctor/dashboard/doctor-dashboard';
import { patientRoutes } from './patient/patient.routes';
import { DashboardShowcaseComponent } from './pages/dashboard-showcase/dashboard-showcase';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent, canActivate: [guestGuard] },
  { path: 'forgot-password', component: ForgotPasswordComponent, canActivate: [guestGuard] },
  { path: 'register', component: RegisterComponent, canActivate: [guestGuard] },
  { path: 'ui-showcase', component: DashboardShowcaseComponent },
  ...adminRoutes,
  ...patientRoutes,
  {
    path: 'doctor/dashboard',
    component: DoctorDashboardComponent,
    canActivate: [authGuard, roleGuard(['DOCTOR'])]
  },
  { path: '**', redirectTo: 'login' }
];
