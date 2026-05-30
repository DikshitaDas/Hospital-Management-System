import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { Appointment } from '../../../admin/models/admin.models';
import { DoctorApiService, DoctorDashboardStats } from '../../../services/doctor-api.service';
import { Notification, NotificationApiService } from '../../../services/notification-api.service';
import { DrawerComponent } from '../../../shared/ui/drawer/drawer';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card';
import { NavbarComponent } from '../../../shared/ui/navbar/navbar';
import { SidebarComponent } from '../../../shared/ui/sidebar/sidebar';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-doctor-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    MetricCardComponent,
    DrawerComponent,
    SnackbarComponent
  ],
  templateUrl: './doctor-dashboard.html',
  styleUrl: './doctor-dashboard.scss'
})
export class DoctorDashboardComponent implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly drawerOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected readonly stats = signal<DoctorDashboardStats | null>(null);
  protected readonly todayAppointments = signal<Appointment[]>([]);
  protected readonly pendingAppointments = signal<Appointment[]>([]);
  protected readonly notifications = signal<Notification[]>([]);

  protected readonly userName: string;
  protected readonly String = String;
  protected readonly Math = Math;

  constructor(
    private doctorApi: DoctorApiService,
    private notificationApi: NotificationApiService,
    private auth: AuthService,
    private router: Router
  ) {
    this.userName = this.auth.getName() ?? 'Doctor';
  }

  ngOnInit(): void {
    forkJoin({
      stats: this.doctorApi.getDashboard(),
      today: this.doctorApi.getTodayAppointments(),
      pending: this.doctorApi.getPendingAppointments(),
      notifications: this.notificationApi.getNotifications()
    }).subscribe({
      next: ({ stats, today, pending, notifications }) => {
        this.stats.set(stats);
        this.todayAppointments.set(today);
        this.pendingAppointments.set(pending.slice(0, 5));
        this.notifications.set(notifications.slice(0, 8));
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Unable to load doctor dashboard. Ensure you logged in with a doctor account.');
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
