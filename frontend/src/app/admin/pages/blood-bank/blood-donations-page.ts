import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { DonateBloodRequest, Donation, Donor } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-blood-donations-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent],
  templateUrl: './blood-donations-page.html',
  styleUrl: './blood-donations-page.scss'
})
export class BloodDonationsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly donations = signal<Donation[]>([]);
  protected readonly donors = signal<Donor[]>([]);
  protected readonly addOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected form: DonateBloodRequest = { donorId: 0, unitsDonated: 1 };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    forkJoin({ donations: this.adminApi.getAllDonations(), donors: this.adminApi.getAllDonors() }).subscribe({
      next: ({ donations, donors }) => {
        this.donations.set(donations);
        this.donors.set(donors);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Failed to load donation history.');
      }
    });
  }

  protected submit(): void {
    if (!this.form.donorId) {
      showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Select a donor.');
      return;
    }
    this.adminApi.donateBlood(this.form).subscribe({
      next: msg => {
        this.addOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Donation recorded — stock updated.');
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Donation failed.'))
    });
  }
}
