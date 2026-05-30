import { Component, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { DoctorProfile } from '../../models/admin.models';
import { statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-doctors-schedule-page',
  standalone: true,
  templateUrl: './doctors-schedule-page.html',
  styleUrl: './doctors-schedule-page.scss'
})
export class DoctorsSchedulePage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly doctors = signal<DoctorProfile[]>([]);
  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getAllDoctors().subscribe({
      next: list => { this.doctors.set(list); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load schedules.'); this.loading.set(false); }
    });
  }
}
