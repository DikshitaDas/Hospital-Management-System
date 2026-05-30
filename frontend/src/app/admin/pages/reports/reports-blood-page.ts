import { Component, OnInit, signal } from '@angular/core';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { downloadCsv } from '../page.util';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-reports-blood-page',
  standalone: true,
  imports: [SnackbarComponent],
  templateUrl: './reports-blood-page.html',
  styleUrl: './reports-blood-page.scss'
})
export class ReportsBloodPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void { this.loading.set(false); }

  protected exportCsv(): void {
    this.loading.set(true);
    forkJoin({ stock: this.adminApi.getAllBloodStock(), requests: this.adminApi.getAllBloodRequests() }).subscribe({
      next: ({ stock, requests }) => {
        const rows: (string | number)[][] = [
          ...stock.map(s => ['STOCK', s.bloodGroup, s.unitsAvailable, '', '']),
          ...requests.map(r => ['REQUEST', r.bloodGroup, r.unitsRequired, r.status, r.requestDate])
        ];
        downloadCsv('blood-bank-report.csv', ['Type', 'Blood Group', 'Units', 'Status', 'Date'], rows);
        this.showSnackbar('Blood bank report exported.');
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
