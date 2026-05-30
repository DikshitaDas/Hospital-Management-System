import { Component, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { DoctorProfile } from '../../models/admin.models';

@Component({
  selector: 'app-doctors-departments-page',
  standalone: true,
  templateUrl: './doctors-departments-page.html',
  styleUrl: './doctors-departments-page.scss'
})
export class DoctorsDepartmentsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly grouped = signal<Record<string, DoctorProfile[]>>({});

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getAllDoctors().subscribe({
      next: list => {
        const map: Record<string, DoctorProfile[]> = {};
        for (const d of list) {
          const key = d.department || 'Unassigned';
          (map[key] ??= []).push(d);
        }
        this.grouped.set(map);
        this.loading.set(false);
      },
      error: () => { this.errorMsg.set('Failed to load doctors.'); this.loading.set(false); }
    });
  }

  protected deptKeys(): string[] { return Object.keys(this.grouped()); }
}
