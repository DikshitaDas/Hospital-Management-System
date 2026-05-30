import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../../../services/auth.service';
import { inject } from '@angular/core';
import { Appointment, Bill } from '../../../admin/models/admin.models';
import { Notification, NotificationApiService } from '../../../services/notification-api.service';
import { PatientApiService } from '../../../services/patient-api.service';
import { CarouselComponent, CarouselSlide } from '../../../shared/ui/carousel/carousel';
import { DrawerComponent } from '../../../shared/ui/drawer/drawer';
import { MetricCardComponent } from '../../../shared/ui/metric-card/metric-card';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { statusBadgeClass } from '../page.util';

interface ActivityItem {
  label: string;
  detail: string;
  status: string;
  date: string;
}

@Component({
  selector: 'app-patient-dashboard-page',
  standalone: true,
  imports: [
    RouterLink,
    CarouselComponent,
    MetricCardComponent,
    DrawerComponent,
    SnackbarComponent
  ],
  templateUrl: './patient-dashboard-page.html',
  styleUrl: './patient-dashboard-page.scss'
})
export class PatientDashboardPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly drawerOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected readonly stats = signal<{
    totalPrescriptions: number;
    admitted: boolean;
  } | null>(null);
  protected readonly upcomingCount = signal(0);
  protected readonly pendingBillsCount = signal(0);
  protected readonly activities = signal<ActivityItem[]>([]);
  protected readonly notifications = signal<Notification[]>([]);
  protected readonly profileName = signal('');

  protected readonly slides: CarouselSlide[] = [
    {
      image: '',
      eyebrow: 'Your care',
      title: 'Welcome to MediCare Hub',
      description: 'Book visits, view prescriptions, pay bills, and track lab results in one place.'
    },
    {
      image: '',
      eyebrow: 'Appointments',
      title: 'Stay on schedule',
      description: 'Book with any available doctor and reschedule when plans change.'
    },
    {
      image: '',
      eyebrow: 'Records',
      title: 'Your health history',
      description: 'Download prescriptions and lab reports anytime.'
    }
  ];

  protected readonly String = String;
  protected readonly Math = Math;
  protected readonly badgeClass = statusBadgeClass;

  private readonly patientId: number | null;
  private readonly auth = inject(AuthService);

  constructor(
    private patientApi: PatientApiService,
    private notificationApi: NotificationApiService
  ) {
    this.patientId = this.auth.getUserId();
  }

  ngOnInit(): void {
    if (!this.patientId) {
      this.errorMsg.set('Session expired. Please log in again.');
      this.loading.set(false);
      return;
    }

    forkJoin({
      stats: this.patientApi.getDashboard(this.patientId).pipe(
        catchError(() => of({ totalAppointments: 0, totalPrescriptions: 0, pendingBills: 0, admitted: false }))
      ),
      profile: this.patientApi.getProfile(this.patientId!).pipe(catchError(() => of(null))),
      appointments: this.patientApi.getAppointments(this.patientId).pipe(catchError(() => of([] as Appointment[]))),
      bills: this.patientApi.getBills(this.patientId).pipe(catchError(() => of([] as Bill[]))),
      notifications: this.notificationApi.getNotifications().pipe(catchError(() => of([])))
    }).subscribe({
      next: ({ stats, profile, appointments, bills, notifications }) => {
        this.profileName.set(profile?.name ?? this.auth.getName() ?? 'Patient');
        this.stats.set({
          totalPrescriptions: stats.totalPrescriptions ?? 0,
          admitted: stats.admitted ?? false
        });
        this.pendingBillsCount.set(stats.pendingBills ?? 0);
        this.upcomingCount.set(this.countUpcoming(appointments));
        this.activities.set(this.buildActivities(appointments, bills));
        this.notifications.set(notifications.slice(0, 8));
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Unable to load dashboard. Check backend and login.');
        this.loading.set(false);
      }
    });
  }

  protected openNotifications(): void {
    this.drawerOpen.set(true);
  }

  private countUpcoming(appointments: Appointment[]): number {
    const today = new Date().toISOString().slice(0, 10);
    return appointments.filter(
      a =>
        a.appointmentDate >= today &&
        !['CANCELLED', 'REJECTED'].includes(a.status?.toUpperCase() ?? '')
    ).length;
  }

  private buildActivities(appointments: Appointment[], bills: Bill[]): ActivityItem[] {
    const items: ActivityItem[] = [];
    for (const a of appointments.slice(0, 5)) {
      const s = a.status?.toUpperCase() ?? '';
      if (['BOOKED', 'APPROVED', 'CONFIRMED'].includes(s)) {
        items.push({
          label: 'Appointment confirmed',
          detail: `Dr. ${a.doctor?.name ?? '—'} · ${a.appointmentDate}`,
          status: a.status,
          date: a.appointmentDate
        });
      }
    }
    for (const b of bills.filter(x => x.status?.toUpperCase() === 'PAID').slice(0, 5)) {
      items.push({
        label: 'Payment successful',
        detail: `Invoice #${b.id} · Rs. ${b.amount}`,
        status: 'PAID',
        date: b.billDate
      });
    }
    return items
      .sort((x, y) => (y.date > x.date ? 1 : -1))
      .slice(0, 8);
  }
}
