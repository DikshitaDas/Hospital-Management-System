import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { AddBloodStockRequest, BloodAvailability, BloodStock } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-blood-stock-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './blood-stock-page.html',
  styleUrl: './blood-stock-page.scss'
})
export class BloodStockPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly stock = signal<BloodStock[]>([]);
  protected readonly availability = signal<BloodAvailability | null>(null);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected addForm: AddBloodStockRequest = { bloodGroup: 'A+', unitsAvailable: 0 };
  protected checkGroup = 'A+';

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllBloodStock().subscribe({
      next: list => { this.stock.set(list); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load blood stock.'); this.loading.set(false); }
    });
  }

  protected submitAdd(): void {
    this.adminApi.addBloodStock(this.addForm).subscribe({
      next: msg => { this.showSnackbar(msg || 'Stock updated.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Add failed.')
    });
  }

  protected checkAvailability(): void {
    this.adminApi.checkBloodAvailability(this.checkGroup).subscribe({
      next: res => { this.availability.set(res); this.showSnackbar(`${res.bloodGroup}: ${res.unitsAvailable} units (${res.available ? 'available' : 'low'})`); },
      error: err => this.showSnackbar(err?.error ?? 'Check failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
