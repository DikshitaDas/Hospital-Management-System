import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PatientApiService } from '../../../services/patient-api.service';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-patient-blood-request-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './blood-request-page.html',
  styleUrl: './blood-request-page.scss'
})
export class PatientBloodRequestPage {
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly emergency = signal(false);

  protected bloodGroup = 'A+';
  protected unitsRequired = 1;

  constructor(private patientApi: PatientApiService) {}

  protected submit(): void {
    this.patientApi
      .requestBlood({
        bloodGroup: this.bloodGroup,
        unitsRequired: this.unitsRequired
      })
      .subscribe({
        next: msg =>
          showSnackbar(
            this.snackbarOpen,
            this.snackbarMessage,
            msg || (this.emergency() ? 'Emergency request submitted.' : 'Blood request submitted.')
          ),
        error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Request failed.'))
      });
  }
}
