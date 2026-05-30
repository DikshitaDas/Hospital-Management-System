import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../../admin/models/admin.models';
import { PatientApiService } from '../../../services/patient-api.service';
import { DatePickerComponent } from '../../../shared/ui/date-picker/date-picker';
import { SearchableSelectComponent } from '../../../shared/ui/searchable-select/searchable-select';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { isPastDate } from '../../../shared/utils/date.util';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-patient-appointments-book-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent, SearchableSelectComponent, DatePickerComponent],
  templateUrl: './appointments-book-page.html',
  styleUrl: './appointments-book-page.scss'
})
export class PatientAppointmentsBookPage {
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly dateError = signal('');

  protected doctorId = 0;
  protected appointmentDate = '';

  constructor(private patientApi: PatientApiService) {}

  protected searchDoctors = (term: string) => this.patientApi.searchDoctors(term);
  protected doctorLabel = (d: User) => `${d.name} · ${d.uhid}`;

  protected submit(): void {
    if (!this.doctorId) {
      showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Select a doctor.');
      return;
    }
    if (!this.appointmentDate || isPastDate(this.appointmentDate)) {
      this.dateError.set('Appointment date cannot be in the past.');
      return;
    }
    this.dateError.set('');
    this.patientApi.bookAppointment({ doctorId: this.doctorId, appointmentDate: this.appointmentDate }).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Appointment requested.');
        this.doctorId = 0;
        this.appointmentDate = '';
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Booking failed.'))
    });
  }
}
