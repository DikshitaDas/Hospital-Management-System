import { Component, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Prescription } from '../../../admin/models/admin.models';
import { PatientApiService } from '../../../services/patient-api.service';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { downloadMedicalRecordPdf, showSnackbar } from '../page.util';

@Component({
  selector: 'app-patient-prescriptions-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './prescriptions-page.html',
  styleUrl: './prescriptions-page.scss'
})
export class PatientPrescriptionsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly prescriptions = signal<Prescription[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  private readonly patientId: number | null;
  private profile = { name: '', uhid: '', gender: '', age: 0, mobile: '' };

  constructor(private patientApi: PatientApiService, auth: AuthService) {
    this.patientId = auth.getUserId();
  }

  ngOnInit(): void {
    if (!this.patientId) {
      this.errorMsg.set('Session expired.');
      this.loading.set(false);
      return;
    }
    forkJoin({
      profile: this.patientApi.getProfile(this.patientId),
      prescriptions: this.patientApi.getPrescriptions(this.patientId)
    }).subscribe({
      next: ({ profile, prescriptions }) => {
        this.profile = {
          name: profile.name,
          uhid: profile.uhid,
          gender: profile.gender,
          age: profile.age,
          mobile: profile.mobile
        };
        this.prescriptions.set(prescriptions);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load prescriptions.');
        this.loading.set(false);
      }
    });
  }

  protected filtered(): Prescription[] {
    const q = this.searchTerm().trim().toLowerCase();
    if (!q) return this.prescriptions();
    return this.prescriptions().filter(
      p =>
        p.diagnosis?.toLowerCase().includes(q) ||
        p.medicines?.toLowerCase().includes(q) ||
        p.appointment?.appointmentDate?.includes(q)
    );
  }

  protected downloadOne(p: Prescription): void {
    downloadMedicalRecordPdf(this.profile, [p]);
    showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Prescription download started.');
  }

  protected downloadAll(): void {
    const list = this.filtered();
    if (!list.length) {
      showSnackbar(this.snackbarOpen, this.snackbarMessage, 'No prescriptions to download.');
      return;
    }
    downloadMedicalRecordPdf(this.profile, list);
  }
}
