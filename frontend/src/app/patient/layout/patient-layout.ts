import { Component, HostListener, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { Notification, NotificationApiService } from '../../services/notification-api.service';
import { DrawerComponent } from '../../shared/ui/drawer/drawer';
import { SnackbarComponent } from '../../shared/ui/snackbar/snackbar';

interface NavItem {
  label: string;
  route?: string;
  icon: string;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-patient-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './patient-sidebar.html',
  styleUrl: './patient-sidebar.scss'
})
export class PatientSidebarComponent implements OnInit {
  protected readonly expanded = signal<Record<string, boolean>>({});

  protected readonly nav: NavItem[] = [
    { label: 'Dashboard', route: '/patient/dashboard', icon: 'dashboard' },
    {
      label: 'Appointments',
      icon: 'appointments',
      children: [
        { label: 'Book Appointment', route: '/patient/appointments/book' },
        { label: 'My Appointments', route: '/patient/appointments' }
      ]
    },
    {
      label: 'Medical Records',
      icon: 'records',
      children: [{ label: 'Prescriptions', route: '/patient/medical/prescriptions' }]
    },
    {
      label: 'Payments',
      icon: 'billing',
      children: [
        { label: 'Bills', route: '/patient/payments/bills' },
        { label: 'Payment History', route: '/patient/payments/history' }
      ]
    },
    {
      label: 'Blood Request',
      icon: 'blood',
      children: [
        { label: 'Request Blood', route: '/patient/blood/request' },
        { label: 'Blood Availability', route: '/patient/blood/availability' }
      ]
    },
    {
      label: 'Lab & Reports',
      icon: 'lab',
      children: [{ label: 'Lab Reports', route: '/patient/lab/reports' }]
    },
    {
      label: 'Profile',
      icon: 'profile',
      children: [{ label: 'My Profile', route: '/patient/profile' }]
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.syncExpanded(this.router.url);
    this.router.events.pipe(filter(e => e instanceof NavigationEnd)).subscribe(e => {
      this.syncExpanded((e as NavigationEnd).urlAfterRedirects);
    });
  }

  protected toggleGroup(key: string): void {
    this.expanded.update(state => ({ ...state, [key]: !state[key] }));
  }

  protected groupKey(label: string): string {
    return label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  }

  private syncExpanded(url: string): void {
    const next: Record<string, boolean> = {};
    for (const item of this.nav) {
      if (!item.children) continue;
      const key = this.groupKey(item.label);
      next[key] = item.children.some(c => url.startsWith(c.route));
    }
    this.expanded.set(next);
  }
}

@Component({
  selector: 'app-patient-navbar',
  standalone: true,
  imports: [DrawerComponent, SnackbarComponent],
  templateUrl: './patient-navbar.html',
  styleUrl: './patient-navbar.scss'
})
export class PatientNavbarComponent implements OnInit {
  protected readonly drawerOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly notifications = signal<Notification[]>([]);
  protected readonly profileOpen = signal(false);

  protected readonly userName: string;
  protected readonly userUhid: string;
  protected readonly avatarUrl: string | null;

  constructor(
    private auth: AuthService,
    private notificationsApi: NotificationApiService,
    private router: Router
  ) {
    this.userName = this.auth.getName() ?? 'Patient';
    this.userUhid = this.auth.getUhid() ?? '';
    const id = this.auth.getUserId();
    this.avatarUrl = id ? localStorage.getItem(`hms_avatar_${id}`) : null;
  }

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.profile-menu')) {
      this.profileOpen.set(false);
    }
  }

  ngOnInit(): void {
    this.notificationsApi.getNotifications().subscribe({
      next: list => this.notifications.set(list),
      error: () => this.notifications.set([])
    });
  }

  protected openNotifications(): void {
    this.drawerOpen.set(true);
  }

  protected toggleProfile(): void {
    this.profileOpen.update(v => !v);
  }

  protected goProfile(): void {
    this.profileOpen.set(false);
    this.router.navigate(['/patient/profile']);
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

@Component({
  selector: 'app-patient-layout',
  standalone: true,
  imports: [PatientSidebarComponent, PatientNavbarComponent, RouterOutlet],
  templateUrl: './patient-layout.html',
  styleUrl: './patient-layout.scss'
})
export class PatientLayoutComponent {}
