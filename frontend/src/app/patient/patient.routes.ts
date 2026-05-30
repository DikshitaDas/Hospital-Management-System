import { Routes } from '@angular/router';
import { authGuard } from '../core/auth.guard';
import { roleGuard } from '../core/role.guard';
import { PatientLayoutComponent } from './layout/patient-layout';
import { PatientDashboardPage } from './pages/dashboard/patient-dashboard-page';
import { PatientAppointmentsBookPage } from './pages/appointments/appointments-book-page';
import { PatientAppointmentsMyPage } from './pages/appointments/appointments-my-page';
import { PatientPrescriptionsPage } from './pages/medical/prescriptions-page';
import { PatientBillsPage } from './pages/payments/bills-page';
import { PatientPaymentHistoryPage } from './pages/payments/payment-history-page';
import { PatientBloodRequestPage } from './pages/blood/blood-request-page';
import { PatientBloodAvailabilityPage } from './pages/blood/blood-availability-page';
import { PatientLabReportsPage } from './pages/lab/lab-reports-page';
import { PatientProfilePage } from './pages/profile/profile-page';

export const patientRoutes: Routes = [
  {
    path: 'patient',
    component: PatientLayoutComponent,
    canActivate: [authGuard, roleGuard(['PATIENT'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: PatientDashboardPage },
      { path: 'appointments/book', component: PatientAppointmentsBookPage },
      { path: 'appointments', component: PatientAppointmentsMyPage },
      { path: 'medical/prescriptions', component: PatientPrescriptionsPage },
      { path: 'payments/bills', component: PatientBillsPage },
      { path: 'payments/history', component: PatientPaymentHistoryPage },
      { path: 'blood/request', component: PatientBloodRequestPage },
      { path: 'blood/availability', component: PatientBloodAvailabilityPage },
      { path: 'lab/reports', component: PatientLabReportsPage },
      { path: 'profile', component: PatientProfilePage }
    ]
  }
];
