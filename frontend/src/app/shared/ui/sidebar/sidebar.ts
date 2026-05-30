import { Component, computed, input } from '@angular/core';
import {
  LucideBed,
  LucideCalendar,
  LucideCreditCard,
  LucideHeartPulse,
  LucideHospital,
  LucideLayoutDashboard,
  LucideSettings,
  LucideStethoscope,
  LucideUser,
  LucideUsers
} from '@lucide/angular';

type SidebarRole = 'ADMIN' | 'DOCTOR' | 'PATIENT';

interface SidebarLink {
  label: string;
  icon: string;
  active: boolean;
}

@Component({
  selector: 'app-sidebar',
  imports: [
    LucideBed,
    LucideCalendar,
    LucideCreditCard,
    LucideHeartPulse,
    LucideHospital,
    LucideLayoutDashboard,
    LucideSettings,
    LucideStethoscope,
    LucideUser,
    LucideUsers
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  readonly role = input<SidebarRole>('ADMIN');

  protected readonly links = computed<SidebarLink[]>(() => {
    switch (this.role()) {
      case 'DOCTOR':
        return [
          { label: 'Dashboard', icon: 'dashboard', active: true },
          { label: 'Appointments', icon: 'appointments', active: false },
          { label: 'My Patients', icon: 'patients', active: false },
          { label: 'Prescriptions', icon: 'reports', active: false },
          { label: 'Lab Reports', icon: 'reports', active: false },
          { label: 'Settings', icon: 'settings', active: false }
        ];
      case 'PATIENT':
        return [
          { label: 'Dashboard', icon: 'dashboard', active: true },
          { label: 'Appointments', icon: 'appointments', active: false },
          { label: 'Prescriptions', icon: 'reports', active: false },
          { label: 'Bills', icon: 'bills', active: false },
          { label: 'Admissions', icon: 'wards', active: false },
          { label: 'Profile', icon: 'profile', active: false }
        ];
      default:
        return [
          { label: 'Dashboard', icon: 'dashboard', active: true },
          { label: 'Patients', icon: 'patients', active: false },
          { label: 'Doctors', icon: 'doctors', active: false },
          { label: 'Appointments', icon: 'appointments', active: false },
          { label: 'Wards', icon: 'wards', active: false },
          { label: 'Reports', icon: 'reports', active: false },
          { label: 'Settings', icon: 'settings', active: false }
        ];
    }
  });

  protected readonly portalLabel = computed(() => {
    switch (this.role()) {
      case 'DOCTOR':
        return 'Doctor Portal';
      case 'PATIENT':
        return 'Patient Portal';
      default:
        return 'Hospital CRM';
    }
  });
}
