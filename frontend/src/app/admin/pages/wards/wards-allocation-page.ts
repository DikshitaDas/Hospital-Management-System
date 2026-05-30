import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { AddBedRequest, Bed, Ward } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-wards-allocation-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent, TooltipDirective],
  templateUrl: './wards-allocation-page.html',
  styleUrl: './wards-allocation-page.scss'
})
export class WardsAllocationPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly wards = signal<Ward[]>([]);
  protected readonly beds = signal<Bed[]>([]);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected form: AddBedRequest = { bedNumber: '', wardId: 0 };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    forkJoin({ wards: this.adminApi.getAllWards(), beds: this.adminApi.getAllBeds() }).subscribe({
      next: ({ wards, beds }) => {
        this.wards.set(wards);
        this.beds.set(beds);
        if (wards.length) this.form.wardId = wards[0].id;
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load wards.');
        this.loading.set(false);
      }
    });
  }

  protected bedsInWard(wardId: number): number {
    return this.beds().filter(b => b.ward?.id === wardId).length;
  }

  protected capacityLeft(ward: Ward): number {
    return Math.max(0, ward.totalBeds - this.bedsInWard(ward.id));
  }

  protected selectedWard(): Ward | undefined {
    return this.wards().find(w => w.id === this.form.wardId);
  }

  protected submit(): void {
    const ward = this.selectedWard();
    if (!ward) {
      showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Select a ward.');
      return;
    }
    if (this.capacityLeft(ward) <= 0) {
      showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Ward bed capacity reached. Increase totalBeds or pick another ward.');
      return;
    }
    this.adminApi.addBed(this.form).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Bed added.');
        this.form.bedNumber = '';
        this.reload();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Add bed failed.'))
    });
  }

  private reload(): void {
    forkJoin({ wards: this.adminApi.getAllWards(), beds: this.adminApi.getAllBeds() }).subscribe({
      next: ({ wards, beds }) => {
        this.wards.set(wards);
        this.beds.set(beds);
      }
    });
  }
}
