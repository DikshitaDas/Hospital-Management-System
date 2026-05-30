import { Component, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { Appointment } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-appointments-requests-page',
  standalone: true,
  imports: [SnackbarComponent],
  templateUrl: './appointments-requests-page.html',
  styleUrl: './appointments-requests-page.scss'
})
export class AppointmentsRequestsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly requests = signal<Appointment[]>([]);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllAppointments().subscribe({
      next: list => {
        this.requests.set(list.filter(a => ['PENDING', 'BOOKED'].includes(a.status.toUpperCase())));
        this.loading.set(false);
      },
      error: () => { this.errorMsg.set('Failed to load requests.'); this.loading.set(false); }
    });
  }

  protected approve(id: number): void {
    this.adminApi.approveAppointment(id).subscribe({
      next: msg => { this.showSnackbar(msg || 'Approved.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Approve failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
