import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { map } from 'rxjs';
import { PAYMENT_METHODS, User } from '../../../admin/models/admin.models';
import { PatientApiService } from '../../../services/patient-api.service';
import { DatePickerComponent } from '../../../shared/ui/date-picker/date-picker';
import { SearchableSelectComponent } from '../../../shared/ui/searchable-select/searchable-select';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { isPastDate } from '../../../shared/utils/date.util';
import { showSnackbar } from '../page.util';

/** Doctor row for search select — `id` is the doctor's user id. */
interface DoctorPick extends User {
  consultationFee: number;
  specialization: string;
  department: string;
}

@Component({
  selector: 'app-patient-appointments-book-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    SnackbarComponent,
    SearchableSelectComponent,
    DatePickerComponent
  ],
  templateUrl: './appointments-book-page.html',
  styleUrl: './appointments-book-page.scss'
})
export class PatientAppointmentsBookPage {
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly dateError = signal('');
  protected readonly selectedDoctor = signal<DoctorPick | null>(null);
  protected readonly payNow = signal(true);
  protected readonly paymentMethod = signal('UPI');
  protected readonly paymentMethods = PAYMENT_METHODS;

  protected doctorId = 0;
  protected appointmentDate = '';

  constructor(
    private patientApi: PatientApiService,
    private router: Router
  ) {}

  protected searchDoctorsForSelect = (term: string) =>
    this.patientApi.searchDoctors(term).pipe(
      map(list =>
        list.map(
          d =>
            ({
              ...d.user,
              consultationFee: d.consultationFee ?? 500,
              specialization: d.specialization,
              department: d.department
            }) as DoctorPick
        )
      )
    );

  protected doctorLabel = (d: DoctorPick) =>
    `${d.name} · ${d.specialization} · Rs. ${d.consultationFee}`;

  protected onDoctorSelected(id: number | null): void {
    this.doctorId = id ?? 0;
  }

  protected onDoctorItem(d: DoctorPick | null): void {
    this.selectedDoctor.set(d);
    this.doctorId = d?.id ?? 0;
  }

  protected consultationFee(): number {
    return this.selectedDoctor()?.consultationFee ?? 500;
  }

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

    this.patientApi
      .bookAppointment({
        doctorId: this.doctorId,
        appointmentDate: this.appointmentDate,
        payNow: this.payNow(),
        paymentMethod: this.payNow() ? this.paymentMethod() : undefined
      })
      .subscribe({
        next: res => {
          showSnackbar(this.snackbarOpen, this.snackbarMessage, res.message || 'Appointment booked.');
          this.doctorId = 0;
          this.appointmentDate = '';
          this.selectedDoctor.set(null);
          if (res.billId && !this.payNow()) {
            this.router.navigate(['/patient/payments/bills']);
          } else if (res.billId && this.payNow()) {
            this.router.navigate(['/patient/payments/history']);
          } else {
            this.router.navigate(['/patient/appointments']);
          }
        },
        error: err =>
          showSnackbar(
            this.snackbarOpen,
            this.snackbarMessage,
            String(err?.error?.message ?? err?.error ?? 'Booking failed.')
          )
      });
  }
}
