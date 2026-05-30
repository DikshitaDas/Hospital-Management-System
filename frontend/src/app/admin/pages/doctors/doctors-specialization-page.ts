import { Component, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { DoctorProfile } from '../../models/admin.models';

@Component({
  selector: 'app-doctors-specialization-page',
  standalone: true,
  templateUrl: './doctors-specialization-page.html',
  styleUrl: './doctors-specialization-page.scss'
})
export class DoctorsSpecializationPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly grouped = signal<Record<string, DoctorProfile[]>>({});

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getAllDoctors().subscribe({
      next: list => {
        const map: Record<string, DoctorProfile[]> = {};
        for (const d of list) {
          const key = d.specialization || 'General';
          (map[key] ??= []).push(d);
        }
        this.grouped.set(map);
        this.loading.set(false);
      },
      error: () => { this.errorMsg.set('Failed to load doctors.'); this.loading.set(false); }
    });
  }

  protected specKeys(): string[] { return Object.keys(this.grouped()); }
}
