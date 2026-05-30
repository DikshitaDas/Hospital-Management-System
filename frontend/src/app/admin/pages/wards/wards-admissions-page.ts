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
  User
} from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { SearchableSelectComponent } from '../../../shared/ui/searchable-select/searchable-select';

@Component({
  selector: 'app-wards-admissions-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent, SearchableSelectComponent],
  templateUrl: './wards-admissions-page.html',
  styleUrl: './wards-admissions-page.scss'
})
export class WardsAdmissionsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly admitted = signal<{ patient: User; admission: Admission }[]>([]);
  protected readonly patients = signal<User[]>([]);
  protected readonly beds = signal<Bed[]>([]);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected admitForm: AdmitPatientRequest = { patientId: 0, bedId: 0 };
  protected transferForm: TransferPatientRequest = { patientId: 0, newBedId: 0 };
  protected emergencyForm: EmergencyAdmissionRequest = { patientId: 0, wardType: 'GENERAL' };
  protected dischargeId = 0;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.loadAll();
  }

  protected loadAll(): void {
    this.loading.set(true);
    forkJoin({ patients: this.adminApi.getAllPatients(), beds: this.adminApi.getAvailableBeds() }).pipe(
      switchMap(({ patients, beds }) => {
        if (!patients.length) {
          return of({ patients, beds, admitted: [] as { patient: User; admission: Admission }[] });
        }
        return forkJoin(
          patients.map(p =>
            this.adminApi.getPatientAdmissions(p.id).pipe(
              map(list =>
                list
                  .filter(a => a.status.toUpperCase() === 'ADMITTED')
                  .map(a => ({ patient: p, admission: a }))
              )
            )
          )
        ).pipe(map(n => ({ patients, beds, admitted: n.flat() })));
      })
    ).subscribe({
      next: ({ patients, beds, admitted }) => {
        this.patients.set(patients);
        this.beds.set(beds);
        this.admitted.set(admitted);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load admissions.');
        this.loading.set(false);
      }
    });
  }

  protected searchPatients = (term: string) => this.adminApi.searchPatients(term);
  protected patientLabel = (p: User) => `${p.name} · ${p.uhid}`;
  protected bedLabel = (b: Bed) =>
    `${b.bedNumber} — ${b.ward?.wardName ?? 'Ward'} [${b.ward?.wardType ?? ''}]`;
  protected admittedPatientLabel = (p: User) => `${p.name} · ${p.uhid}`;

  protected submitAdmit(): void {
    if (!this.admitForm.patientId || !this.admitForm.bedId) {
      this.showSnackbar('Select patient and bed.');
      return;
    }
    this.adminApi.admitPatient(this.admitForm).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Admitted.');
        this.loadAll();
      },
      error: err => this.showSnackbar(err?.error ?? 'Failed.')
    });
  }

  protected submitDischarge(): void {
    if (!this.dischargeId) return;
    this.adminApi.dischargePatient(this.dischargeId).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Discharged.');
        this.loadAll();
      },
      error: err => this.showSnackbar(err?.error ?? 'Failed.')
    });
  }

  protected submitTransfer(): void {
    this.adminApi.transferPatient(this.transferForm).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Transferred.');
        this.loadAll();
      },
      error: err => this.showSnackbar(err?.error ?? 'Failed.')
    });
  }

  protected submitEmergency(): void {
    this.adminApi.emergencyAdmission(this.emergencyForm).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Emergency admission.');
        this.loadAll();
      },
      error: err => this.showSnackbar(err?.error ?? 'Failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
