import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { Bill, PAYMENT_METHODS } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { downloadBillInvoice, statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-billing-payments-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent, ModalComponent],
  templateUrl: './billing-payments-page.html',
  styleUrl: './billing-payments-page.scss'
})
export class BillingPaymentsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly paidBills = signal<Bill[]>([]);
  protected readonly pendingBills = signal<Bill[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly payModalOpen = signal(false);
  protected readonly payingBill = signal<Bill | null>(null);
  protected readonly paymentMethod = signal('CASH');
  protected readonly paymentMethods = PAYMENT_METHODS;
  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllBills().subscribe({
      next: list => {
        this.paidBills.set(list.filter(b => b.status.toUpperCase() === 'PAID'));
        this.pendingBills.set(list.filter(b => b.status.toUpperCase() === 'PENDING'));
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load payments.');
        this.loading.set(false);
      }
    });
  }

  protected filterBills(list: Bill[]): Bill[] {
    const q = this.searchTerm().trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      b =>
        String(b.id).includes(q) ||
        (b.patient?.name?.toLowerCase().includes(q) ?? false) ||
        (b.patient?.uhid?.toLowerCase().includes(q) ?? false) ||
        (b.patient?.mobile?.includes(q) ?? false)
    );
  }

  protected openPayModal(bill: Bill): void {
    this.payingBill.set(bill);
    this.paymentMethod.set('CASH');
    this.payModalOpen.set(true);
  }

  protected closePayModal(): void {
    this.payModalOpen.set(false);
    this.payingBill.set(null);
  }

  protected confirmPay(): void {
    const bill = this.payingBill();
    if (!bill) return;
    const method = this.paymentMethod().trim();
    if (!method) {
      this.showSnackbar('Select a payment method.');
      return;
    }
    this.adminApi.payBill(bill.id, { paymentMethod: method }).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Payment recorded.');
        this.closePayModal();
        this.load();
      },
      error: err => this.showSnackbar(err?.error ?? 'Payment failed.')
    });
  }

  protected downloadInvoice(b: Bill): void {
    downloadBillInvoice(b);
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
