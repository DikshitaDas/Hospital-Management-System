import { Component, OnInit, signal } from '@angular/core';
import { AdminApiService } from '../../../services/admin-api.service';
import { Bill } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-billing-payments-page',
  standalone: true,
  imports: [SnackbarComponent],
  templateUrl: './billing-payments-page.html',
  styleUrl: './billing-payments-page.scss'
})
export class BillingPaymentsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly paidBills = signal<Bill[]>([]);
  protected readonly pendingBills = signal<Bill[]>([]);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllBills().subscribe({
      next: list => {
        this.paidBills.set(list.filter(b => b.status.toUpperCase() === 'PAID'));
        this.pendingBills.set(list.filter(b => b.status.toUpperCase() === 'PENDING'));
        this.loading.set(false);
      },
      error: () => { this.errorMsg.set('Failed to load payments.'); this.loading.set(false); }
    });
  }

  protected pay(id: number): void {
    this.adminApi.payBill(id).subscribe({
      next: msg => { this.showSnackbar(msg || 'Payment recorded.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Payment failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
