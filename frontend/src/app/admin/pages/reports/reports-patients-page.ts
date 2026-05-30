import { Component, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { User } from '../../models/admin.models';
import { downloadCsv } from '../page.util';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-reports-patients-page',
  standalone: true,
  imports: [SnackbarComponent],
  templateUrl: './reports-patients-page.html',
  styleUrl: './reports-patients-page.scss'
})
export class ReportsPatientsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly patients = signal<User[]>([]);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getAllPatients().subscribe({
      next: list => { this.patients.set(list); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load patients.'); this.loading.set(false); }
    });
  }

  protected exportCsv(): void {
    downloadCsv('patients-report.csv', ['UHID', 'Name', 'Gender', 'Age', 'Mobile', 'Role'],
      this.patients().map(p => [p.uhid, p.name, p.gender, p.age, p.mobile, p.role]));
    this.showSnackbar('Patient report exported.');
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
