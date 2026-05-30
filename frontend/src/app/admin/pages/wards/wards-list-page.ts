import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { AddWardRequest, UpdateWardRequest, Ward } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-wards-list-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent],
  templateUrl: './wards-list-page.html',
  styleUrl: './wards-list-page.scss'
})
export class WardsListPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly wards = signal<Ward[]>([]);
  protected readonly addOpen = signal(false);
  protected readonly editOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected addForm: AddWardRequest = { wardName: '', wardType: 'GENERAL', totalBeds: 0 };
  protected editForm: UpdateWardRequest & { id?: number } = { wardName: '', wardType: 'GENERAL', totalBeds: 0 };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllWards().subscribe({
      next: list => { this.wards.set(list); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load wards.'); this.loading.set(false); }
    });
  }

  protected submitAdd(): void {
    this.adminApi.addWard(this.addForm).subscribe({
      next: msg => { this.addOpen.set(false); this.showSnackbar(msg || 'Ward added.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Add failed.')
    });
  }

  protected openEdit(w: Ward): void {
    this.editForm = { id: w.id, wardName: w.wardName, wardType: w.wardType, totalBeds: w.totalBeds };
    this.editOpen.set(true);
  }

  protected submitEdit(): void {
    if (!this.editForm.id) return;
    const { id, ...body } = this.editForm;
    this.adminApi.updateWard(id, body).subscribe({
      next: msg => { this.editOpen.set(false); this.showSnackbar(msg || 'Ward updated.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Update failed.')
    });
  }

  protected deleteWard(id: number): void {
    if (!confirm('Delete ward?')) return;
    this.adminApi.deleteWard(id).subscribe({
      next: msg => { this.showSnackbar(msg || 'Ward deleted.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Delete failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
