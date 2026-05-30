import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Bill } from '../../../admin/models/admin.models';
import { PatientApiService } from '../../../services/patient-api.service';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { downloadBillInvoice } from '../page.util';

@Component({
  selector: 'app-patient-payment-history-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './payment-history-page.html',
  styleUrl: './payment-history-page.scss'
})
export class PatientPaymentHistoryPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly paidBills = signal<Bill[]>([]);
  protected readonly searchTerm = signal('');

  private readonly patientId: number | null;

  constructor(private patientApi: PatientApiService, auth: AuthService) {
    this.patientId = auth.getUserId();
  }

  ngOnInit(): void {
    if (!this.patientId) return;
    this.patientApi.getBills(this.patientId).subscribe({
      next: list => {
        this.paidBills.set(list.filter(b => b.status?.toUpperCase() === 'PAID'));
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load payment history.');
        this.loading.set(false);
      }
    });
  }

  protected filtered(): Bill[] {
    const q = this.searchTerm().trim().toLowerCase();
    if (!q) return this.paidBills();
    return this.paidBills().filter(
      b =>
        String(b.id).includes(q) ||
        b.billType?.toLowerCase().includes(q) ||
        (b.paymentMethod?.toLowerCase().includes(q) ?? false)
    );
  }

  protected downloadReceipt(b: Bill): void {
    downloadBillInvoice(b);
  }
}
