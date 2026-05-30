import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { Appointment, BookAppointmentRequest, RescheduleAppointmentRequest, User } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-appointments-list-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent],
  templateUrl: './appointments-list-page.html',
  styleUrl: './appointments-list-page.scss'
})
export class AppointmentsListPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly patients = signal<User[]>([]);
  protected readonly doctors = signal<User[]>([]);
  protected readonly bookOpen = signal(false);
  protected readonly rescheduleOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected bookForm: BookAppointmentRequest = { patientId: 0, doctorId: 0, appointmentDate: '' };
  protected rescheduleForm: RescheduleAppointmentRequest & { id?: number } = { appointmentDate: '' };
  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    forkJoin({
      appointments: this.adminApi.getAllAppointments(),
      patients: this.adminApi.getAllPatients(),
      doctors: this.adminApi.getAllDoctors()
    }).subscribe({
      next: ({ appointments, patients, doctors }) => {
        this.appointments.set(appointments);
        this.patients.set(patients);
        this.doctors.set(doctors.map(d => d.user));
        this.loading.set(false);
      },
      error: () => { this.errorMsg.set('Failed to load appointments.'); this.loading.set(false); }
    });
  }

  protected openBook(): void { this.bookOpen.set(true); }

  protected submitBook(): void {
    this.adminApi.bookAppointment(this.bookForm).subscribe({
      next: msg => { this.bookOpen.set(false); this.showSnackbar(msg || 'Appointment booked.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Booking failed.')
    });
  }

  protected openReschedule(a: Appointment): void {
    this.rescheduleForm = { id: a.id, appointmentDate: a.appointmentDate };
    this.rescheduleOpen.set(true);
  }

  protected submitReschedule(): void {
    if (!this.rescheduleForm.id) return;
    const { id, appointmentDate } = this.rescheduleForm;
    this.adminApi.rescheduleAppointment(id, { appointmentDate }).subscribe({
      next: msg => { this.rescheduleOpen.set(false); this.showSnackbar(msg || 'Rescheduled.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Reschedule failed.')
    });
  }

  protected cancel(id: number): void {
    this.adminApi.cancelAppointment(id).subscribe({
      next: msg => { this.showSnackbar(msg || 'Cancelled.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Cancel failed.')
    });
  }

  protected approve(id: number): void {
    this.adminApi.approveAppointment(id).subscribe({
      next: msg => { this.showSnackbar(msg || 'Approved.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Approve failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
