import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { map } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import {
  Appointment,
  BookAppointmentRequest,
  DoctorProfile,
  RescheduleAppointmentRequest,
  User
} from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { SearchableSelectComponent } from '../../../shared/ui/searchable-select/searchable-select';
import { DatePickerComponent } from '../../../shared/ui/date-picker/date-picker';
import { statusBadgeClass } from '../page.util';
import { isPastDate, toInputDate } from '../../../shared/utils/date.util';

@Component({
  selector: 'app-appointments-list-page',
  standalone: true,
  imports: [
    FormsModule,
    ModalComponent,
    SnackbarComponent,
    SearchableSelectComponent,
    DatePickerComponent
  ],
  templateUrl: './appointments-list-page.html',
  styleUrl: './appointments-list-page.scss'
})
export class AppointmentsListPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly bookOpen = signal(false);
  protected readonly rescheduleOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly dateError = signal('');

  protected bookForm: BookAppointmentRequest = { patientId: 0, doctorId: 0, appointmentDate: '' };
  protected rescheduleForm: RescheduleAppointmentRequest & { id?: number } = { appointmentDate: '' };
  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllAppointments().subscribe({
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

  protected searchPatients = (term: string) =>
    this.adminApi.searchPatients(term);

  protected searchDoctors = (term: string) =>
    this.adminApi.searchDoctors(term).pipe(map(list => list.map(d => d.user)));

  protected patientLabel = (p: User) => `${p.name} · ${p.uhid} · ${p.mobile}`;
  protected doctorLabel = (d: User) => `${d.name} · ${d.uhid}`;

  protected openBook(): void {
    this.bookForm = { patientId: 0, doctorId: 0, appointmentDate: '' };
    this.dateError.set('');
    this.bookOpen.set(true);
  }

  protected submitBook(): void {
    if (!this.bookForm.patientId || !this.bookForm.doctorId) {
      this.showSnackbar('Select patient and doctor from search results.');
      return;
    }
    if (!this.bookForm.appointmentDate || isPastDate(this.bookForm.appointmentDate)) {
      this.dateError.set('Appointment date cannot be in the past.');
      return;
    }
    this.adminApi.bookAppointment(this.bookForm).subscribe({
      next: res => {
        this.bookOpen.set(false);
        const detail =
          res.billId != null
            ? `${res.message ?? 'Booked.'} Record payment under Billing → Payments.`
            : res.message ?? 'Booking failed.';
        this.showSnackbar(detail);
        this.load();
      },
      error: err => this.showSnackbar(err?.error?.message ?? err?.error ?? 'Booking failed.')
    });
  }

  protected openReschedule(a: Appointment): void {
    this.rescheduleForm = {
      id: a.id,
      appointmentDate: toInputDate(a.appointmentDate)
    };
    this.dateError.set('');
    this.rescheduleOpen.set(true);
  }

  protected submitReschedule(): void {
    if (!this.rescheduleForm.id) return;
    if (!this.rescheduleForm.appointmentDate || isPastDate(this.rescheduleForm.appointmentDate)) {
      this.dateError.set('New date cannot be in the past.');
      return;
    }
    const { id, appointmentDate } = this.rescheduleForm;
    this.adminApi.rescheduleAppointment(id, { appointmentDate }).subscribe({
      next: msg => {
        this.rescheduleOpen.set(false);
        this.showSnackbar(msg || 'Rescheduled.');
        this.load();
      },
      error: err => this.showSnackbar(err?.error ?? 'Reschedule failed.')
    });
  }

  protected cancel(id: number): void {
    this.adminApi.cancelAppointment(id).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Cancelled.');
        this.load();
      },
      error: err => this.showSnackbar(err?.error ?? 'Cancel failed.')
    });
  }

  protected approve(id: number): void {
    this.adminApi.approveAppointment(id).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Approved.');
        this.load();
      },
      error: err => this.showSnackbar(err?.error ?? 'Approve failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
