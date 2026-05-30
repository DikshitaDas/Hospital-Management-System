import { Component, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { Bed, WardOccupancy } from '../../models/admin.models';
import { statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-wards-availability-page',
  standalone: true,
  templateUrl: './wards-availability-page.html',
  styleUrl: './wards-availability-page.scss'
})
export class WardsAvailabilityPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly beds = signal<Bed[]>([]);
  protected readonly occupancy = signal<WardOccupancy[]>([]);
  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    forkJoin({ beds: this.adminApi.getAvailableBeds(), occupancy: this.adminApi.getWardOccupancy() }).subscribe({
      next: ({ beds, occupancy }) => { this.beds.set(beds); this.occupancy.set(occupancy); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load availability.'); this.loading.set(false); }
    });
  }
}
