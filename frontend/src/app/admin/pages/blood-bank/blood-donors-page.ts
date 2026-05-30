import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { AddDonorRequest } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-blood-donors-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './blood-donors-page.html',
  styleUrl: './blood-donors-page.scss'
})
export class BloodDonorsPage {
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected form: AddDonorRequest = { donorName: '', bloodGroup: 'A+', mobile: '' };

  constructor(private adminApi: AdminApiService) {}

  protected submit(): void {
    this.adminApi.addDonor(this.form).subscribe({
      next: msg => { this.showSnackbar(msg || 'Donor registered.'); this.form = { donorName: '', bloodGroup: 'A+', mobile: '' }; },
      error: err => this.showSnackbar(err?.error ?? 'Failed to add donor.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
