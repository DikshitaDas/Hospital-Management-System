import { Component, HostListener, OnInit, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../services/auth.service';
import { NotificationApiService, Notification } from '../../services/notification-api.service';
import { DrawerComponent } from '../../shared/ui/drawer/drawer';
import { SnackbarComponent } from '../../shared/ui/snackbar/snackbar';

interface NavItem {
  label: string;
  route?: string;
  icon: string;
  children?: { label: string; route: string }[];
}

@Component({
  selector: 'app-admin-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './admin-sidebar.html',
  styleUrl: './admin-sidebar.scss'
})
export class AdminSidebarComponent implements OnInit {
  protected readonly expanded = signal<Record<string, boolean>>({});

  protected readonly nav: NavItem[] = [
    { label: 'Dashboard', route: '/admin/dashboard', icon: 'dashboard' },
    {
      label: 'Patients',
      icon: 'patients',
      children: [
        { label: 'All Patients', route: '/admin/patients' },
        { label: 'Admitted & Discharge', route: '/admin/patients/admitted' },
        { label: 'Medical Records', route: '/admin/patients/records' }
      ]
    },
    {
      label: 'Doctors',
      icon: 'doctors',
      children: [
        { label: 'All Doctors', route: '/admin/doctors' },
        { label: 'Departments', route: '/admin/doctors/departments' },
        { label: 'Doctor Schedule', route: '/admin/doctors/schedule' },
        { label: 'Specialization', route: '/admin/doctors/specialization' }
      ]
    },
    {
      label: 'Appointments',
      icon: 'appointments',
      children: [
        { label: 'All Appointments', route: '/admin/appointments' },
        { label: 'Appointment Calendar', route: '/admin/appointments/calendar' },
        { label: 'Appointment Requests', route: '/admin/appointments/requests' }
      ]
    },
    {
      label: 'Blood Bank & Donor',
      icon: 'blood',
      children: [
        { label: 'Blood Stock', route: '/admin/blood-bank/stock' },
        { label: 'Donor List', route: '/admin/blood-bank/donors' },
        { label: 'Blood Requests', route: '/admin/blood-bank/requests' },
        { label: 'Donation History', route: '/admin/blood-bank/donations' }
      ]
    },
    {
      label: 'Billing',
      icon: 'billing',
      children: [
        { label: 'Invoices', route: '/admin/billing/invoices' },
        { label: 'Payments', route: '/admin/billing/payments' }
      ]
    },
    { label: 'Reports', route: '/admin/reports', icon: 'reports' },
    {
      label: 'Bed/Ward Management',
      icon: 'wards',
      children: [
        { label: 'All Wards', route: '/admin/wards' },
        { label: 'Bed Allocation', route: '/admin/wards/allocation' },
        { label: 'Bed Availability', route: '/admin/wards/availability' },
        { label: 'ICU / General Ward', route: '/admin/wards/types' },
        { label: 'Admission & Discharge', route: '/admin/wards/admissions' }
      ]
    },
    {
      label: 'Lab & Reports',
      icon: 'lab',
      children: [
        { label: 'Test Types & Pricing', route: '/admin/lab/tests' },
        { label: 'Upload / Update Reports', route: '/admin/lab/reports' }
      ]
    },
    {
      label: 'Settings',
      icon: 'settings',
      children: [
        { label: 'Hospital Profile', route: '/admin/settings/hospital' },
        { label: 'My Account', route: '/admin/settings/account' },
        { label: 'Roles & Permissions', route: '/admin/settings/roles' },
        { label: 'Wards & Beds Overview', route: '/admin/settings/wards' }
      ]
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
  selector: 'app-admin-navbar',
  standalone: true,
  imports: [DrawerComponent, SnackbarComponent],
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.scss'
})
export class AdminNavbarComponent implements OnInit {
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
    this.userName = this.auth.getName() ?? 'Admin';
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
    this.router.navigate(['/admin/settings/account']);
  }

  protected onSearchInput(value: string): void {
    const q = value.trim();
    if (q.length >= 2) {
      this.router.navigate(['/admin/patients'], { queryParams: { search: q } });
    }
  }

  protected logout(): void {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [AdminSidebarComponent, AdminNavbarComponent, RouterOutlet],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayoutComponent {}
