import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { AddDonorRequest, Donor } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-blood-donors-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent, TooltipDirective],
  templateUrl: './blood-donors-page.html',
  styleUrl: './blood-donors-page.scss'
})
export class BloodDonorsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly donors = signal<Donor[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly addOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected form: AddDonorRequest = { donorName: '', bloodGroup: 'A+', mobile: '' };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllDonors().subscribe({
      next: list => {
        this.donors.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.donors.set([]);
        this.loading.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Failed to load donors.');
      }
    });
  }

  protected filtered(): Donor[] {
    const q = this.searchTerm().trim().toLowerCase();
    if (!q) return this.donors();
    return this.donors().filter(
      d => d.donorName.toLowerCase().includes(q) || d.bloodGroup.toLowerCase().includes(q) || d.mobile.includes(q)
    );
  }

  protected submit(): void {
    this.adminApi.addDonor(this.form).subscribe({
      next: msg => {
        this.addOpen.set(false);
        this.form = { donorName: '', bloodGroup: 'A+', mobile: '' };
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Donor registered.');
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Failed to add donor.'))
    });
  }
}
