import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Bill, PAYMENT_METHODS } from '../../../admin/models/admin.models';
import { PatientApiService } from '../../../services/patient-api.service';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { downloadBillInvoice, showSnackbar } from '../page.util';

@Component({
  selector: 'app-patient-bills-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent],
  templateUrl: './bills-page.html',
  styleUrl: './bills-page.scss'
})
export class PatientBillsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly pendingBills = signal<Bill[]>([]);
  protected readonly payModalOpen = signal(false);
  protected readonly payingBill = signal<Bill | null>(null);
  protected readonly paymentMethod = signal('UPI');
  protected readonly paymentMethods = PAYMENT_METHODS;
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  private readonly patientId: number | null;

  constructor(private patientApi: PatientApiService, auth: AuthService) {
    this.patientId = auth.getUserId();
  }

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    if (!this.patientId) return;
    this.loading.set(true);
    this.patientApi.getBills(this.patientId).subscribe({
      next: list => {
        this.pendingBills.set(list.filter(b => b.status?.toUpperCase() === 'PENDING'));
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load bills.');
        this.loading.set(false);
      }
    });
  }

  protected openPay(bill: Bill): void {
    this.payingBill.set(bill);
    this.paymentMethod.set('UPI');
    this.payModalOpen.set(true);
  }

  protected closePay(): void {
    this.payModalOpen.set(false);
    this.payingBill.set(null);
  }

  protected confirmPay(): void {
    const bill = this.payingBill();
    if (!bill) return;
    this.patientApi.payBill(bill.id, { paymentMethod: this.paymentMethod() }).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Payment successful.');
        this.closePay();
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Payment failed.'))
    });
  }

  protected downloadInvoice(b: Bill): void {
    downloadBillInvoice(b);
  }
}
