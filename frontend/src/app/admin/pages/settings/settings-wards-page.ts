import { Component, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { WardOccupancy } from '../../models/admin.models';

@Component({
  selector: 'app-settings-wards-page',
  standalone: true,
  templateUrl: './settings-wards-page.html',
  styleUrl: './settings-wards-page.scss'
})
export class SettingsWardsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly occupancy = signal<WardOccupancy[]>([]);

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getWardOccupancy().subscribe({
      next: list => { this.occupancy.set(list); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load ward overview.'); this.loading.set(false); }
    });
  }

  protected occupancyPercent(w: WardOccupancy): number {
    if (!w.totalBeds) return 0;
    return Math.round((w.occupiedBeds / w.totalBeds) * 100);
  }
}
