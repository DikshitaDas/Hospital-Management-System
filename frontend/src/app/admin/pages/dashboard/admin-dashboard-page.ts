import { Component, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { Notification, NotificationApiService } from '../../../services/notification-api.service';
import { Appointment, Bill, DashboardStats, Prescription } from '../../models/admin.models';
import { CarouselComponent, CarouselSlide } from '../../../shared/ui/carousel/carousel';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { DrawerComponent } from '../../../shared/ui/drawer/drawer';
import { isFutureDate, statusBadgeClass } from '../page.util';

interface ActivityItem {
  label: string;
  detail: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-admin-dashboard-page',
  standalone: true,
  imports: [CarouselComponent, MetricCardComponent, SnackbarComponent, DrawerComponent],
  templateUrl: './admin-dashboard-page.html',
  styleUrl: './admin-dashboard-page.scss'
})
export class AdminDashboardPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly drawerOpen = signal(false);

  protected readonly stats = signal<DashboardStats | null>(null);
  protected readonly upcomingCount = signal(0);
  protected readonly prescriptionCount = signal(0);
  protected readonly activities = signal<ActivityItem[]>([]);
  protected readonly notifications = signal<Notification[]>([]);

  protected readonly slides: CarouselSlide[] = [
    {
      image: '',
      eyebrow: 'Operations',
      title: 'Unified hospital control',
      description: 'Patients, doctors, wards, billing, and lab — connected to Spring Boot + MySQL.'
    },
    {
      image: '',
      eyebrow: 'Admissions',
      title: 'Beds drive admissions',
      description: 'Create wards, add beds (Bed Allocation), then admit patients to AVAILABLE beds.'
    },
    {
      image: '',
      eyebrow: 'Live data',
      title: 'Real-time dashboards',
      description: 'Stats from GET /api/admin/dashboard/stats and related endpoints.'
    }
  ];

  protected readonly String = String;
  protected readonly badgeClass = statusBadgeClass;
  protected readonly Math = Math;

  constructor(
    private adminApi: AdminApiService,
    private notificationApi: NotificationApiService
  ) {}

  ngOnInit(): void {
    forkJoin({
      stats: this.adminApi.getDashboardStats(),
      appointments: this.adminApi.getAllAppointments(),
      prescriptions: this.adminApi.getAllPrescriptions(),
      bills: this.adminApi.getAllBills(),
      notifications: this.notificationApi.getNotifications()
    }).subscribe({
      next: ({ stats, appointments, prescriptions, bills, notifications }) => {
        this.stats.set(stats);
        this.upcomingCount.set(appointments.filter(a => isFutureDate(a.appointmentDate)).length);
        this.prescriptionCount.set(prescriptions.length);

        const apptActivities: ActivityItem[] = appointments
          .filter(a => ['APPROVED', 'BOOKED'].includes(a.status.toUpperCase()))
          .slice(0, 6)
          .map(a => ({
            label: `${a.patient?.name ?? 'Patient'} → Dr. ${a.doctor?.name ?? 'Doctor'}`,
            detail: `Appointment on ${a.appointmentDate}`,
            status: a.status,
            date: a.appointmentDate
          }));

        const billActivities: ActivityItem[] = bills
          .filter(b => b.status.toUpperCase() === 'PAID')
          .slice(0, 6)
          .map(b => ({
            label: `Bill #${b.id} — ${b.patient?.name ?? 'Patient'}`,
            detail: `Rs. ${b.amount} (${b.billType})`,
            status: b.status,
            date: b.billDate
          }));

        this.activities.set(
          [...apptActivities, ...billActivities]
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .slice(0, 10)
        );
        this.notifications.set(notifications.slice(0, 10));
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Unable to load dashboard. Check that the backend is running.');
        this.loading.set(false);
      }
    });
  }

  protected refresh(): void {
    this.loading.set(true);
    this.errorMsg.set('');
    this.ngOnInit();
    this.showSnackbar('Dashboard refreshed.');
  }

  protected openNotifications(): void {
    this.drawerOpen.set(true);
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }

  protected formatRevenue(value: number): string {
    if (value >= 100000) return `Rs. ${(value / 100000).toFixed(1)}L`;
    return `Rs. ${value.toLocaleString('en-IN')}`;
  }
}
