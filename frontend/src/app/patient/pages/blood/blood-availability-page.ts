import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BloodAvailability } from '../../../admin/models/admin.models';
import { PatientApiService } from '../../../services/patient-api.service';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-patient-blood-availability-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './blood-availability-page.html',
  styleUrl: './blood-availability-page.scss'
})
export class PatientBloodAvailabilityPage {
  protected readonly loading = signal(false);
  protected readonly result = signal<BloodAvailability | null>(null);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected bloodGroup = 'A+';

  constructor(private patientApi: PatientApiService) {}

  protected check(): void {
    this.loading.set(true);
    this.patientApi.checkBloodAvailability(this.bloodGroup).subscribe({
      next: res => {
        this.result.set(res);
        this.loading.set(false);
      },
      error: err => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Check failed.'));
        this.loading.set(false);
      }
    });
  }
}
