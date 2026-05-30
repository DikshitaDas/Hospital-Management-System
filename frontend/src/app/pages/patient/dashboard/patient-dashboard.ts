import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Appointment } from '../../../services/admin-api.service';
import { Notification, NotificationApiService } from '../../../services/notification-api.service';
import {
  PatientApiService,
  PatientDashboardStats,
  PatientProfile
} from '../../../services/patient-api.service';
import { DrawerComponent } from '../../../shared/ui/drawer/drawer';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card';
import { NavbarComponent } from '../../../shared/ui/navbar/navbar';
import { SidebarComponent } from '../../../shared/ui/sidebar/sidebar';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-patient-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    MetricCardComponent,
    DrawerComponent,
    SnackbarComponent
  ],
  templateUrl: './patient-dashboard.html',
  styleUrl: './patient-dashboard.scss'
})
export class PatientDashboardComponent implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly drawerOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected readonly stats = signal<PatientDashboardStats | null>(null);
  protected readonly profile = signal<PatientProfile | null>(null);
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly notifications = signal<Notification[]>([]);

  protected readonly userName: string;
  protected readonly String = String;
  protected readonly Math = Math;
  private readonly patientId: number | null;

  constructor(
    private patientApi: PatientApiService,
    private notificationApi: NotificationApiService,
    private auth: AuthService,
    private router: Router
  ) {
    this.userName = this.auth.getName() ?? 'Patient';
    this.patientId = this.auth.getUserId();
  }

  ngOnInit(): void {
    if (!this.patientId) {
      this.errorMsg.set('Patient session is missing user id. Please log in again.');
      this.loading.set(false);
      return;
    }

    forkJoin({
      stats: this.patientApi.getDashboard(this.patientId),
      profile: this.patientApi.getProfile(),
      appointments: this.patientApi.getAppointments(this.patientId),
      notifications: this.notificationApi.getNotifications()
    }).subscribe({
      next: ({ stats, profile, appointments, notifications }) => {
        this.stats.set(stats);
        this.profile.set(profile);
        this.appointments.set(appointments.slice(0, 6));
        this.notifications.set(notifications.slice(0, 8));
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Unable to load patient dashboard. Check backend and login again.');
        this.loading.set(false);
      }
    });
  }

  protected openNotifications(): void {
    this.drawerOpen.set(true);
  }

  protected openSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  protected statusClass(status: string): string {
    const normalized = status.toUpperCase();
    if (['APPROVED', 'BOOKED'].includes(normalized)) return '';
    if (['PENDING', 'RESCHEDULED'].includes(normalized)) return 'warm';
    if (['CANCELLED'].includes(normalized)) return 'danger';
    return 'cool';
  }
}
