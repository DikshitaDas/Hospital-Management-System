import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { Bill, CreateBillRequest, User } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { SearchableSelectComponent } from '../../../shared/ui/searchable-select/searchable-select';
import { statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-billing-invoices-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent, SearchableSelectComponent],
  templateUrl: './billing-invoices-page.html',
  styleUrl: './billing-invoices-page.scss'
})
export class BillingInvoicesPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly bills = signal<Bill[]>([]);
  protected readonly showPendingOnly = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly badgeClass = statusBadgeClass;
  protected form: CreateBillRequest = { patientId: 0, amount: 0, billType: 'CONSULTATION' };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllBills().subscribe({
      next: bills => {
        this.bills.set(bills);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load bills.');
        this.loading.set(false);
      }
    });
  }

  protected filteredBills(): Bill[] {
    return this.showPendingOnly()
      ? this.bills().filter(b => b.status.toUpperCase() === 'PENDING')
      : this.bills();
  }

  protected searchPatients = (term: string) => this.adminApi.searchPatients(term);
  protected patientLabel = (p: User) => `${p.name} · ${p.uhid}`;

  protected submit(): void {
    if (!this.form.patientId) {
      this.showSnackbar('Select a patient from search.');
      return;
    }
    this.adminApi.createBill(this.form).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Bill created.');
        this.load();
      },
      error: err => this.showSnackbar(err?.error ?? 'Create failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
