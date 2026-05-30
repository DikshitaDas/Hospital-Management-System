import { Routes } from '@angular/router';
import { authGuard } from '../core/auth.guard';
import { roleGuard } from '../core/role.guard';
import { AdminLayoutComponent } from './layout/admin-layout';
import { AdminDashboardPage } from './pages/dashboard/admin-dashboard-page';
import { PatientsListPage } from './pages/patients/patients-list-page';
import { PatientsAdmittedPage } from './pages/patients/patients-admitted-page';
import { PatientsRecordsPage } from './pages/patients/patients-records-page';
import { DoctorsListPage } from './pages/doctors/doctors-list-page';
import { DoctorsSubCrudPage } from './pages/doctors/doctors-sub-crud-page';
import { DepartmentsMasterPage } from './pages/doctors/departments-master-page';
import { SpecializationMasterPage } from './pages/doctors/specialization-master-page';
import { AppointmentsListPage } from './pages/appointments/appointments-list-page';
import { AppointmentsCalendarPage } from './pages/appointments/appointments-calendar-page';
import { AppointmentsRequestsPage } from './pages/appointments/appointments-requests-page';
import { BloodStockPage } from './pages/blood-bank/blood-stock-page';
import { BloodDonorsPage } from './pages/blood-bank/blood-donors-page';
import { BloodRequestsPage } from './pages/blood-bank/blood-requests-page';
import { BloodDonationsPage } from './pages/blood-bank/blood-donations-page';
import { BillingInvoicesPage } from './pages/billing/billing-invoices-page';
import { BillingPaymentsPage } from './pages/billing/billing-payments-page';
import { ReportsPatientsPage } from './pages/reports/reports-patients-page';
import { ReportsAppointmentsPage } from './pages/reports/reports-appointments-page';
import { ReportsBloodPage } from './pages/reports/reports-blood-page';
import { ReportsDoctorsPage } from './pages/reports/reports-doctors-page';
import { WardsListPage } from './pages/wards/wards-list-page';
import { WardsAllocationPage } from './pages/wards/wards-allocation-page';
import { WardsAvailabilityPage } from './pages/wards/wards-availability-page';
import { WardsTypesPage } from './pages/wards/wards-types-page';
import { WardsAdmissionsPage } from './pages/wards/wards-admissions-page';
import { LabTestsPage } from './pages/lab/lab-tests-page';
import { LabReportsPage } from './pages/lab/lab-reports-page';
import { SettingsProfilePage } from './pages/settings/settings-profile-page';
import { SettingsRolesPage } from './pages/settings/settings-roles-page';
import { SettingsWardsPage } from './pages/settings/settings-wards-page';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: AdminLayoutComponent,
    canActivate: [authGuard, roleGuard(['ADMIN'])],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: AdminDashboardPage },
      { path: 'patients', component: PatientsListPage },
      { path: 'patients/admitted', component: PatientsAdmittedPage },
      { path: 'patients/records', component: PatientsRecordsPage },
      { path: 'doctors', component: DoctorsListPage },
      { path: 'doctors/departments', component: DepartmentsMasterPage },
      { path: 'doctors/schedule', component: DoctorsSubCrudPage, data: { mode: 'schedule' } },
      { path: 'doctors/specialization', component: SpecializationMasterPage },
      { path: 'appointments', component: AppointmentsListPage },
      { path: 'appointments/calendar', component: AppointmentsCalendarPage },
      { path: 'appointments/requests', component: AppointmentsRequestsPage },
      { path: 'blood-bank/stock', component: BloodStockPage },
      { path: 'blood-bank/donors', component: BloodDonorsPage },
      { path: 'blood-bank/requests', component: BloodRequestsPage },
      { path: 'blood-bank/donations', component: BloodDonationsPage },
      { path: 'billing/invoices', component: BillingInvoicesPage },
      { path: 'billing/payments', component: BillingPaymentsPage },
      { path: 'reports/patients', component: ReportsPatientsPage },
      { path: 'reports/appointments', component: ReportsAppointmentsPage },
      { path: 'reports/blood-bank', component: ReportsBloodPage },
      { path: 'reports/doctors', component: ReportsDoctorsPage },
      { path: 'wards', component: WardsListPage },
      { path: 'wards/allocation', component: WardsAllocationPage },
      { path: 'wards/availability', component: WardsAvailabilityPage },
      { path: 'wards/types', component: WardsTypesPage },
      { path: 'wards/admissions', component: WardsAdmissionsPage },
      { path: 'lab/tests', component: LabTestsPage },
      { path: 'lab/reports', component: LabReportsPage },
      { path: 'settings/profile', component: SettingsProfilePage },
      { path: 'settings/roles', component: SettingsRolesPage },
      { path: 'settings/wards', component: SettingsWardsPage }
    ]
  }
];
