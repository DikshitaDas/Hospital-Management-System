import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { UpdateLabReportRequest } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-lab-reports-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './lab-reports-page.html',
  styleUrl: './lab-reports-page.scss'
})
export class LabReportsPage {
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected reportId = 0;
  protected form: UpdateLabReportRequest = { result: '' };

  constructor(private adminApi: AdminApiService) {}

  protected submit(): void {
    if (!this.reportId) { this.showSnackbar('Enter a report ID.'); return; }
    this.adminApi.updateLabReport(this.reportId, this.form).subscribe({
      next: msg => { this.showSnackbar(msg || 'Report updated.'); },
      error: err => this.showSnackbar(err?.error ?? 'Update failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
