import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { Bed, Ward } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { wardTypeMatches } from '../page.util';

@Component({
  selector: 'app-wards-types-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './wards-types-page.html',
  styleUrl: './wards-types-page.scss'
})
export class WardsTypesPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly wards = signal<Ward[]>([]);
  protected readonly beds = signal<Bed[]>([]);
  protected readonly filter = signal<'ALL' | 'ICU' | 'GENERAL' | 'PRIVATE'>('ALL');

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getAllWards().subscribe({
      next: wards => {
        this.wards.set(wards);
        this.adminApi.getAllBeds().subscribe({
          next: beds => {
            this.beds.set(beds);
            this.loading.set(false);
          },
          error: () => this.loading.set(false)
        });
      },
      error: () => {
        this.errorMsg.set('Failed to load wards.');
        this.loading.set(false);
      }
    });
  }

  protected filteredWards(): Ward[] {
    const f = this.filter();
    if (f === 'ALL') return this.wards();
    return this.wards().filter(w => wardTypeMatches(w.wardType, f));
  }

  protected bedsFor(wardId: number): Bed[] {
    return this.beds().filter(b => b.ward?.id === wardId);
  }
}
