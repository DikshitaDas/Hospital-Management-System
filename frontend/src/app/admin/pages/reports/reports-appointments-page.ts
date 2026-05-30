import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { Appointment } from '../../models/admin.models';
import { downloadCsv } from '../page.util';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-reports-appointments-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './reports-appointments-page.html',
  styleUrl: './reports-appointments-page.scss'
})
export class ReportsAppointmentsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly appointments = signal<Appointment[]>([]);
  protected readonly fromDate = signal('');
  protected readonly toDate = signal('');
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getAllAppointments().subscribe({
      next: list => { this.appointments.set(list); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load appointments.'); this.loading.set(false); }
    });
  }

  protected filtered(): Appointment[] {
    const from = this.fromDate();
    const to = this.toDate();
    return this.appointments().filter(a => {
      const d = a.appointmentDate?.slice(0, 10) ?? '';
      if (from && d < from) return false;
      if (to && d > to) return false;
      return true;
    });
  }

  protected exportCsv(): void {
    downloadCsv('appointments-report.csv', ['Date', 'Patient', 'Doctor', 'Status', 'Token'],
      this.filtered().map(a => [a.appointmentDate, a.patient?.name ?? '', a.doctor?.name ?? '', a.status, a.tokenNumber]));
    this.showSnackbar('Appointments report exported.');
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
