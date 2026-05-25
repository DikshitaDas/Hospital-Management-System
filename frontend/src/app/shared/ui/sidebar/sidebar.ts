import { Component } from '@angular/core';
import {
  LucideBed,
  LucideCalendar,
  LucideHeartPulse,
  LucideHospital,
  LucideLayoutDashboard,
  LucideSettings,
  LucideStethoscope,
  LucideUsers
} from '@lucide/angular';

@Component({
  selector: 'app-sidebar',
  imports: [
    LucideBed,
    LucideCalendar,
    LucideHeartPulse,
    LucideHospital,
    LucideLayoutDashboard,
    LucideSettings,
    LucideStethoscope,
    LucideUsers
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class SidebarComponent {
  protected readonly links = [
    { label: 'Dashboard', icon: 'dashboard', active: true },
    { label: 'Patients', icon: 'patients', active: false },
    { label: 'Doctors', icon: 'doctors', active: false },
    { label: 'Appointments', icon: 'appointments', active: false },
    { label: 'Wards', icon: 'wards', active: false },
    { label: 'Reports', icon: 'reports', active: false },
    { label: 'Settings', icon: 'settings', active: false }
  ];
}
