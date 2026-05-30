import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Appointment } from '../../../admin/models/admin.models';
import { PatientApiService } from '../../../services/patient-api.service';
import { DatePickerComponent } from '../../../shared/ui/date-picker/date-picker';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { isPastDate, toInputDate } from '../../../shared/utils/date.util';
import { showSnackbar, statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-patient-appointments-my-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent, DatePickerComponent],
  templateUrl: './appointments-my-page.html',
  styleUrl: './appointments-my-page.scss'
})
export class PatientAppointmentsMyPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly rescheduleOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly dateError = signal('');
  protected readonly badgeClass = statusBadgeClass;

  protected rescheduleId = 0;
  protected rescheduleDate = '';

  private readonly patientId: number | null;

  constructor(private patientApi: PatientApiService, auth: AuthService) {
    this.patientId = auth.getUserId();
  }

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    if (!this.patientId) return;
    this.loading.set(true);
    this.patientApi.getAppointments(this.patientId).subscribe({
      next: list => {
        this.appointments.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load appointments.');
        this.loading.set(false);
      }
    });
  }

  protected openReschedule(a: Appointment): void {
    this.rescheduleId = a.id;
    this.rescheduleDate = toInputDate(a.appointmentDate);
    this.dateError.set('');
    this.rescheduleOpen.set(true);
  }

  protected submitReschedule(): void {
    if (!this.rescheduleId) return;
    if (!this.rescheduleDate || isPastDate(this.rescheduleDate)) {
      this.dateError.set('New date cannot be in the past.');
      return;
    }
    this.patientApi.rescheduleAppointment(this.rescheduleId, { appointmentDate: this.rescheduleDate }).subscribe({
      next: msg => {
        this.rescheduleOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Rescheduled.');
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Reschedule failed.'))
    });
  }

  protected cancel(id: number): void {
    if (!confirm('Cancel this appointment?')) return;
    this.patientApi.cancelAppointment(id).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Cancelled.');
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Cancel failed.'))
    });
  }

  protected canModify(a: Appointment): boolean {
    const s = a.status?.toUpperCase() ?? '';
    return !['CANCELLED', 'REJECTED', 'COMPLETED'].includes(s);
  }
}
