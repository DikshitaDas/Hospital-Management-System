import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { CreatePrescriptionRequest, Prescription, User } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-patients-records-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './patients-records-page.html',
  styleUrl: './patients-records-page.scss'
})
export class PatientsRecordsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly patients = signal<User[]>([]);
  protected readonly prescriptions = signal<Prescription[]>([]);
  protected readonly selectedPatientId = signal(0);
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

  protected submitPrescription(): void {
    this.adminApi.createPrescription(this.rxForm).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Prescription created.');
        this.loadPrescriptions();
      },
      error: err => this.showSnackbar(err?.error ?? 'Failed to create prescription.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
