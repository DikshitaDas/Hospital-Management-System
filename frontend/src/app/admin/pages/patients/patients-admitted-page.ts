import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
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
import { AccordionComponent } from '../../../shared/ui/accordion/accordion';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { SearchableSelectComponent } from '../../../shared/ui/searchable-select/searchable-select';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { showSnackbar, statusBadgeClass } from '../page.util';

interface AdmittedRow {
  patient: User;
  admission: Admission;
}

@Component({
  selector: 'app-patients-admitted-page',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink,
    AccordionComponent,
    SnackbarComponent,
    TooltipDirective,
    SearchableSelectComponent
  ],
  templateUrl: './patients-admitted-page.html',
  styleUrl: './patients-admitted-page.scss'
})
export class PatientsAdmittedPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly admitted = signal<AdmittedRow[]>([]);
  protected readonly patients = signal<User[]>([]);
  protected readonly beds = signal<Bed[]>([]);
  protected readonly allBeds = signal<Bed[]>([]);
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
    this.errorMsg.set('');
    forkJoin({
      patients: this.adminApi.getAllPatients(),
      beds: this.adminApi.getAvailableBeds(),
      allBeds: this.adminApi.getAllBeds(),
      wards: this.adminApi.getAllWards()
    }).pipe(
      switchMap(({ patients, beds, allBeds, wards }) => {
        if (!patients.length) {
          return of({ patients, beds, allBeds, wards, admissions: [] as AdmittedRow[] });
        }
        return forkJoin(
          patients.map(p =>
            this.adminApi.getPatientAdmissions(p.id).pipe(
              map(list =>
                list
                  .filter(a => a.status?.toUpperCase() === 'ADMITTED')
                  .map(a => ({ patient: p, admission: a }))
              )
            )
          )
        ).pipe(map(nested => ({ patients, beds, allBeds, wards, admissions: nested.flat() })));
      })
    ).subscribe({
      next: ({ patients, beds, allBeds, wards, admissions }) => {
        this.patients.set(patients);
        this.beds.set(beds);
        this.allBeds.set(allBeds);
        this.wards.set(wards);
        this.admitted.set(admissions);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load admissions. Ensure backend is running.');
        this.loading.set(false);
      }
    });
  }

  protected refreshBeds(): void {
    this.adminApi.getAvailableBeds().subscribe({
      next: list => {
        this.beds.set(list);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, `${list.length} available bed(s) loaded.`);
      },
      error: () => showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Could not refresh beds.')
    });
  }

  protected submitAdmit(): void {
    if (!this.admitForm.patientId || !this.admitForm.bedId) {
      showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Select patient and bed.');
      return;
    }
    this.adminApi.admitPatient(this.admitForm).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Patient admitted.');
        this.admitForm = { patientId: 0, bedId: 0 };
        this.loadAll();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Admission failed.'))
    });
  }

  protected submitDischarge(): void {
    if (!this.dischargeId) return;
    this.adminApi.dischargePatient(this.dischargeId).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Patient discharged.');
        this.dischargeId = 0;
        this.loadAll();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Discharge failed.'))
    });
  }

  protected submitTransfer(): void {
    this.adminApi.transferPatient(this.transferForm).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Patient transferred.');
        this.loadAll();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Transfer failed.'))
    });
  }

  protected submitEmergency(): void {
    this.adminApi.emergencyAdmission(this.emergencyForm).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Emergency admission done.');
        this.loadAll();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Emergency admission failed.'))
    });
  }

  protected searchPatients = (term: string) => this.adminApi.searchPatients(term);

  protected patientLabel = (p: User) => `${p.name} · ${p.uhid}`;

  protected bedLabel = (b: Bed) =>
    `${b.bedNumber} — ${b.ward?.wardName ?? 'Ward'} [${b.ward?.wardType ?? ''}]`;

  protected admittedPatientLabel = (p: User) => `${p.name} · ${p.uhid}`;
}
