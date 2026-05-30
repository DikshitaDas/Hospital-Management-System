import { Component, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import {
  AdminApiService,
  Appointment,
  DashboardStats,
  WardOccupancy
} from '../../../services/admin-api.service';
import { Notification, NotificationApiService } from '../../../services/notification-api.service';
import { DrawerComponent } from '../../../shared/ui/drawer/drawer';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card';
import { NavbarComponent } from '../../../shared/ui/navbar/navbar';
import { SidebarComponent } from '../../../shared/ui/sidebar/sidebar';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [
    SidebarComponent,
    NavbarComponent,
    MetricCardComponent,
    DrawerComponent,
    SnackbarComponent
  ],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.scss'
})
export class AdminDashboardComponent implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly drawerOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly wardOccupancy = signal<WardOccupancy[]>([]);
  protected readonly pendingBills = signal(0);
  protected readonly bedOccupancyPercent = signal(0);
  protected readonly notifications = signal<Notification[]>([]);

  protected readonly userName: string;
  protected readonly String = String;

  constructor(
    private adminApi: AdminApiService,
    private notificationApi: NotificationApiService,
    private auth: AuthService,
    private router: Router
  ) {
    this.userName = this.auth.getName() ?? 'Admin';
  }

  ngOnInit(): void {
    forkJoin({
      stats: this.adminApi.getDashboardStats(),
      appointments: this.adminApi.getAppointments(),
      wards: this.adminApi.getWardOccupancy(),
      bills: this.adminApi.getBills(),
      notifications: this.notificationApi.getNotifications()
    }).subscribe({
      next: ({ stats, appointments, wards, bills, notifications }) => {
        this.stats.set(stats);
        this.appointments.set(appointments.slice(0, 6));
        this.wardOccupancy.set(wards);
        this.pendingBills.set(bills.filter(b => b.status === 'PENDING').length);
        this.bedOccupancyPercent.set(this.calculateBedOccupancy(wards));
        this.notifications.set(notifications.slice(0, 8));
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Unable to load admin dashboard. Check that the backend is running.');
        this.loading.set(false);
      }
    });
  }

  protected refresh(): void {
    this.openSnackbar('Dashboard refreshed from Spring Boot API.');
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
    if (['APPROVED', 'BOOKED', 'PAID'].includes(normalized)) return '';
    if (['PENDING', 'RESCHEDULED'].includes(normalized)) return 'warm';
    if (['CANCELLED'].includes(normalized)) return 'danger';
    return 'cool';
  }

  protected formatRevenue(value: number): string {
    if (value >= 100000) {
      return `Rs. ${(value / 100000).toFixed(1)}L`;
    }
    return `Rs. ${value.toLocaleString('en-IN')}`;
  }

  private calculateBedOccupancy(wards: WardOccupancy[]): number {
    const total = wards.reduce((sum, ward) => sum + ward.totalBeds, 0);
    const occupied = wards.reduce((sum, ward) => sum + ward.occupiedBeds, 0);
    if (!total) return 0;
    return Math.round((occupied / total) * 100);
  }
}
