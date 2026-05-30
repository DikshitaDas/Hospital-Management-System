import { Component, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { downloadCsv } from '../page.util';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-reports-doctors-page',
  standalone: true,
  imports: [SnackbarComponent],
  templateUrl: './reports-doctors-page.html',
  styleUrl: './reports-doctors-page.scss'
})
export class ReportsDoctorsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void { this.loading.set(false); }

  protected exportCsv(): void {
    this.loading.set(true);
    this.adminApi.getAllDoctors().subscribe({
      next: list => {
        downloadCsv('doctors-report.csv', ['Name', 'Department', 'Specialization', 'Fee', 'Availability'],
          list.map(d => [d.user.name, d.department, d.specialization, d.consultationFee, d.availability]));
        this.showSnackbar('Doctors report exported.');
        this.loading.set(false);
      },
      error: () => { this.errorMsg.set('Export failed.'); this.loading.set(false); }
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
