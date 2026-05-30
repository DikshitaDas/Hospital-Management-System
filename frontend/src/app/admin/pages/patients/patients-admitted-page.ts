import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, map, of, switchMap } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import {
  Admission,
  AdmitPatientRequest,
  Bed,
  EmergencyAdmissionRequest,
  TransferPatientRequest,
  User,
  Ward
} from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { statusBadgeClass } from '../page.util';

interface AdmittedRow {
  patient: User;
  admission: Admission;
}

@Component({
  selector: 'app-patients-admitted-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './patients-admitted-page.html',
  styleUrl: './patients-admitted-page.scss'
})
export class PatientsAdmittedPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly admitted = signal<AdmittedRow[]>([]);
  protected readonly patients = signal<User[]>([]);
  protected readonly beds = signal<Bed[]>([]);
  protected readonly wards = signal<Ward[]>([]);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected admitForm: AdmitPatientRequest = { patientId: 0, bedId: 0 };
  protected transferForm: TransferPatientRequest = { patientId: 0, newBedId: 0 };
  protected emergencyForm: EmergencyAdmissionRequest = { patientId: 0, wardType: 'GENERAL' };
  protected dischargeId = 0;

  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  protected loadAll(): void {
    this.loading.set(true);
    forkJoin({
      patients: this.adminApi.getAllPatients(),
      beds: this.adminApi.getAvailableBeds(),
      wards: this.adminApi.getAllWards()
    }).pipe(
      switchMap(({ patients, beds, wards }) => {
        if (!patients.length) return of({ patients, beds, wards, admissions: [] as AdmittedRow[] });
        return forkJoin(
          patients.map(p =>
            this.adminApi.getPatientAdmissions(p.id).pipe(
              map(list => list.filter(a => a.status.toUpperCase() === 'ADMITTED').map(a => ({ patient: p, admission: a })))
            )
          )
        ).pipe(map(nested => ({ patients, beds, wards, admissions: nested.flat() })));
      })
    ).subscribe({
      next: ({ patients, beds, wards, admissions }) => {
        this.patients.set(patients);
        this.beds.set(beds);
        this.wards.set(wards);
        this.admitted.set(admissions);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load admissions data.');
        this.loading.set(false);
      }
    });
  }

  protected submitAdmit(): void {
    this.adminApi.admitPatient(this.admitForm).subscribe({
      next: msg => { this.showSnackbar(msg || 'Patient admitted.'); this.loadAll(); },
      error: err => this.showSnackbar(err?.error ?? 'Admission failed.')
    });
  }

  protected submitDischarge(): void {
    if (!this.dischargeId) return;
    this.adminApi.dischargePatient(this.dischargeId).subscribe({
      next: msg => { this.showSnackbar(msg || 'Patient discharged.'); this.loadAll(); },
      error: err => this.showSnackbar(err?.error ?? 'Discharge failed.')
    });
  }

  protected submitTransfer(): void {
    this.adminApi.transferPatient(this.transferForm).subscribe({
      next: msg => { this.showSnackbar(msg || 'Patient transferred.'); this.loadAll(); },
      error: err => this.showSnackbar(err?.error ?? 'Transfer failed.')
    });
  }

  protected submitEmergency(): void {
    this.adminApi.emergencyAdmission(this.emergencyForm).subscribe({
      next: msg => { this.showSnackbar(msg || 'Emergency admission created.'); this.loadAll(); },
      error: err => this.showSnackbar(err?.error ?? 'Emergency admission failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
