import { Component, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { Appointment } from '../../models/admin.models';
import { statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-appointments-calendar-page',
  standalone: true,
  templateUrl: './appointments-calendar-page.html',
  styleUrl: './appointments-calendar-page.scss'
})
export class AppointmentsCalendarPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly byDate = signal<Record<string, Appointment[]>>({});
  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getAllAppointments().subscribe({
      next: list => {
        const map: Record<string, Appointment[]> = {};
        for (const a of list) {
          const day = a.appointmentDate?.slice(0, 10) ?? 'Unknown';
          (map[day] ??= []).push(a);
        }
        this.byDate.set(map);
        this.loading.set(false);
      },
      error: () => { this.errorMsg.set('Failed to load calendar.'); this.loading.set(false); }
    });
  }

  protected dateKeys(): string[] {
    return Object.keys(this.byDate()).sort();
  }
}
