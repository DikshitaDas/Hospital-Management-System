import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { DonateBloodRequest } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-blood-donations-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './blood-donations-page.html',
  styleUrl: './blood-donations-page.scss'
})
export class BloodDonationsPage {
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected form: DonateBloodRequest = { donorId: 0, unitsDonated: 1 };

  constructor(private adminApi: AdminApiService) {}

  protected submit(): void {
    this.adminApi.donateBlood(this.form).subscribe({
      next: msg => { this.showSnackbar(msg || 'Donation recorded.'); },
      error: err => this.showSnackbar(err?.error ?? 'Donation failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
