import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { LabReport } from '../../../admin/models/admin.models';
import { PatientApiService } from '../../../services/patient-api.service';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { downloadPrintableHtml, statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-patient-lab-reports-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './lab-reports-page.html',
  styleUrl: './lab-reports-page.scss'
})
export class PatientLabReportsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly reports = signal<LabReport[]>([]);
  protected readonly statusFilter = signal('ALL');
  protected readonly searchTerm = signal('');
  protected readonly badgeClass = statusBadgeClass;

  private readonly patientId: number | null;

  constructor(private patientApi: PatientApiService, auth: AuthService) {
    this.patientId = auth.getUserId();
  }

  ngOnInit(): void {
    if (!this.patientId) return;
    this.patientApi.getLabReports(this.patientId).subscribe({
      next: list => {
        this.reports.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load lab reports.');
        this.loading.set(false);
      }
    });
  }

  protected filtered(): LabReport[] {
    const q = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    return this.reports().filter(r => {
      if (status !== 'ALL' && r.status?.toUpperCase() !== status) return false;
      if (!q) return true;
      const test = r.labTest?.testName?.toLowerCase() ?? '';
      return String(r.id).includes(q) || test.includes(q);
    });
  }

  protected downloadReport(r: LabReport): void {
    const html = `<pre style="white-space:pre-wrap;font-family:Segoe UI,Arial,sans-serif;font-size:13px">${(r.result ?? 'Results pending').replace(/</g, '&lt;')}</pre>`;
    downloadPrintableHtml(
      `lab-report-${r.id}.pdf`,
      `Lab Report #${r.id} — ${r.labTest?.testName ?? 'Test'}`,
      html
    );
  }
}
