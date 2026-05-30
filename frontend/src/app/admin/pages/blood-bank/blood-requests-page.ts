import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { BloodRequest, CreateBloodRequest, User } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-blood-requests-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './blood-requests-page.html',
  styleUrl: './blood-requests-page.scss'
})
export class BloodRequestsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly requests = signal<BloodRequest[]>([]);
  protected readonly patients = signal<User[]>([]);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly badgeClass = statusBadgeClass;
  protected form: CreateBloodRequest = { patientId: 0, bloodGroup: 'A+', unitsRequired: 1 };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    forkJoin({ requests: this.adminApi.getAllBloodRequests(), patients: this.adminApi.getAllPatients() }).subscribe({
      next: ({ requests, patients }) => { this.requests.set(requests); this.patients.set(patients); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load blood requests.'); this.loading.set(false); }
    });
  }

  protected submit(): void {
    this.adminApi.requestBlood(this.form).subscribe({
      next: msg => { this.showSnackbar(msg || 'Request submitted.'); this.ngOnInit(); },
      error: err => this.showSnackbar(err?.error ?? 'Request failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
