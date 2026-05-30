import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { LabReport, UpdateLabReportRequest } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { FileUploadComponent } from '../../../shared/ui/file-upload/file-upload';
import { downloadPrintableHtml, showSnackbar } from '../page.util';

interface LabResultLine {
  parameter: string;
  value: string;
  unit: string;
  reference: string;
}

@Component({
  selector: 'app-lab-reports-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent, FileUploadComponent],
  templateUrl: './lab-reports-page.html',
  styleUrl: './lab-reports-page.scss'
})
export class LabReportsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly reports = signal<LabReport[]>([]);
  protected readonly editOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly statusFilter = signal('ALL');

  protected selectedReportId: number | null = null;
  protected reportSearch = '';
  protected patientName = '';
  protected testName = '';
  protected sampleDate = '';
  protected remarks = '';
  protected attachmentName = '';
  protected lines: LabResultLine[] = [
    { parameter: '', value: '', unit: '', reference: '' }
  ];

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllLabReports().subscribe({
      next: list => {
        this.reports.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.reports.set([]);
        this.loading.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Could not load lab reports. Restart backend.');
      }
    });
  }

  protected filteredReports(): LabReport[] {
    const q = this.reportSearch.trim().toLowerCase();
    const status = this.statusFilter();
    return this.reports().filter(r => {
      if (status !== 'ALL' && r.status.toUpperCase() !== status) return false;
      if (!q) return true;
      const patient = r.appointment?.patient?.name?.toLowerCase() ?? '';
      const test = r.labTest?.testName?.toLowerCase() ?? '';
      return String(r.id).includes(q) || patient.includes(q) || test.includes(q);
    });
  }

  protected openEdit(r: LabReport): void {
    this.selectedReportId = r.id;
    this.patientName = r.appointment?.patient?.name ?? '';
    this.testName = r.labTest?.testName ?? '';
    this.sampleDate = r.appointment?.appointmentDate?.slice(0, 10) ?? '';
    this.remarks = '';
    this.parseResult(r.result ?? '');
    this.editOpen.set(true);
  }

  protected addLine(): void {
    this.lines = [...this.lines, { parameter: '', value: '', unit: '', reference: '' }];
  }

  protected removeLine(i: number): void {
    this.lines = this.lines.filter((_, idx) => idx !== i);
    if (!this.lines.length) this.addLine();
  }

  protected onAttachment(file: { name: string }): void {
    this.attachmentName = file.name;
  }

  protected submit(): void {
    if (!this.selectedReportId) return;
    const body: UpdateLabReportRequest = { result: this.buildResultText() };
    this.adminApi.updateLabReport(this.selectedReportId, body).subscribe({
      next: msg => {
        this.editOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Report saved.');
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Save failed.'))
    });
  }

  protected downloadReport(r: LabReport): void {
    const html = `<pre style="white-space:pre-wrap;font-family:Segoe UI,Arial,sans-serif;font-size:13px">${(r.result ?? 'Pending').replace(/</g, '&lt;')}</pre>`;
    downloadPrintableHtml(
      `lab-report-${r.id}.pdf`,
      `Lab Report #${r.id} — ${r.labTest?.testName ?? 'Test'}`,
      html
    );
  }

  private buildResultText(): string {
    const header = [
      `Patient: ${this.patientName}`,
      `Test: ${this.testName}`,
      `Sample date: ${this.sampleDate}`,
      `Attachment: ${this.attachmentName || 'None'}`,
      '',
      '--- RESULTS ---'
    ];
    const rows = this.lines
      .filter(l => l.parameter.trim())
      .map(l => `${l.parameter}: ${l.value} ${l.unit} (Ref: ${l.reference})`);
    return [...header, ...rows, '', `Remarks: ${this.remarks}`].join('\n');
  }

  private parseResult(raw: string): void {
    const lines = raw.split('\n').filter(l => l.includes(':'));
    const parsed: LabResultLine[] = [];
    for (const line of lines) {
      const m = line.match(/^([^:]+):\s*([^(]+)\s*\(Ref:\s*(.+)\)/);
      if (m) {
        const valueParts = m[2]!.trim().split(/\s+/);
        parsed.push({
          parameter: m[1]!.trim(),
          value: valueParts[0] ?? '',
          unit: valueParts.slice(1).join(' '),
          reference: m[3]!.trim()
        });
      }
    }
    this.lines = parsed.length ? parsed : [{ parameter: '', value: '', unit: '', reference: '' }];
    const remarksLine = raw.split('\n').find(l => l.startsWith('Remarks:'));
    this.remarks = remarksLine ? remarksLine.replace('Remarks:', '').trim() : '';
  }
}
