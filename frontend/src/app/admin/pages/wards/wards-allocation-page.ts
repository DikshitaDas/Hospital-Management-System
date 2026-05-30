import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { AddBedRequest, Ward } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-wards-allocation-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './wards-allocation-page.html',
  styleUrl: './wards-allocation-page.scss'
})
export class WardsAllocationPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly wards = signal<Ward[]>([]);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected form: AddBedRequest = { bedNumber: '', wardId: 0 };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getAllWards().subscribe({
      next: list => { this.wards.set(list); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load wards.'); this.loading.set(false); }
    });
  }

  protected submit(): void {
    this.adminApi.addBed(this.form).subscribe({
      next: msg => { this.showSnackbar(msg || 'Bed added.'); this.form = { bedNumber: '', wardId: 0 }; },
      error: err => this.showSnackbar(err?.error ?? 'Add bed failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
