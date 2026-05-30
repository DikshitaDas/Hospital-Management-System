import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AdminApiService } from '../../../services/admin-api.service';
import { Appointment, CreatePrescriptionRequest, Prescription, User } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-patients-records-page',
  standalone: true,
  imports: [FormsModule, RouterLink, ModalComponent, SnackbarComponent, TooltipDirective],
  templateUrl: './patients-records-page.html',
  styleUrl: './patients-records-page.scss'
})
export class PatientsRecordsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly patients = signal<User[]>([]);
  protected readonly prescriptions = signal<Prescription[]>([]);
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly selectedPatientId = signal(0);
  protected readonly searchTerm = signal('');
  protected readonly rxOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected rxForm: CreatePrescriptionRequest = {
    appointmentId: 0,
    diagnosis: '',
    medicines: '',
    dosageInstructions: ''
  };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getAllPatients().subscribe({
      next: list => {
        this.patients.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load patients.');
        this.loading.set(false);
      }
    });
    this.adminApi.getAllAppointments().subscribe({
      next: list => this.appointments.set(list),
      error: () => this.appointments.set([])
    });
  }

  protected filteredPatients(): User[] {
    const q = this.searchTerm().trim().toLowerCase();
    if (!q) return this.patients();
    return this.patients().filter(
      p => p.name.toLowerCase().includes(q) || p.uhid.toLowerCase().includes(q) || p.mobile.includes(q)
    );
  }

  protected patientAppointments(): Appointment[] {
    const pid = this.selectedPatientId();
    if (!pid) return [];
    return this.appointments().filter(a => a.patient?.id === pid);
  }

  protected onPatientChange(id: number): void {
    this.selectedPatientId.set(id);
    this.loadPrescriptions();
  }

  protected loadPrescriptions(): void {
    const id = this.selectedPatientId();
    if (!id) return;
    this.loading.set(true);
    this.adminApi.getPatientPrescriptions(id).subscribe({
      next: list => {
        this.prescriptions.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load prescriptions.');
        this.loading.set(false);
      }
    });
  }

  protected openRxModal(): void {
    const appts = this.patientAppointments();
    if (!appts.length) {
      showSnackbar(this.snackbarOpen, this.snackbarMessage, 'No appointments for this patient. Book one first.');
      return;
    }
    this.rxForm = {
      appointmentId: appts[0].id,
      diagnosis: '',
      medicines: '',
      dosageInstructions: ''
    };
    this.rxOpen.set(true);
  }

  protected submitPrescription(): void {
    if (!this.rxForm.appointmentId) {
      showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Select an appointment.');
      return;
    }
    this.adminApi.createPrescription(this.rxForm).subscribe({
      next: msg => {
        this.rxOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Prescription created.');
        this.loadPrescriptions();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Failed to create prescription.'))
    });
  }

  protected appointmentLabel(a: Appointment): string {
    return `#${a.id} — ${a.appointmentDate} — Dr. ${a.doctor?.name ?? 'N/A'} — ${a.status}`;
  }
}
