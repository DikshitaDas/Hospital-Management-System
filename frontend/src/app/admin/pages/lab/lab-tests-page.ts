import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { CreateLabTestRequest, LabTest } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-lab-tests-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './lab-tests-page.html',
  styleUrl: './lab-tests-page.scss'
})
export class LabTestsPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly tests = signal<LabTest[]>([]);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected form: CreateLabTestRequest = { testName: '', category: '', price: 0, description: '' };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllLabTests().subscribe({
      next: list => { this.tests.set(list); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load lab tests.'); this.loading.set(false); }
    });
  }

  protected submit(): void {
    this.adminApi.createLabTest(this.form).subscribe({
      next: msg => { this.showSnackbar(msg || 'Lab test created.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Create failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
