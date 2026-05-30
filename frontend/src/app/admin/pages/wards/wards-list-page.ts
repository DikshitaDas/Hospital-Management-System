import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin, switchMap } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { AddWardRequest, Bed, UpdateWardRequest, Ward } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-wards-list-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent, TooltipDirective],
  templateUrl: './wards-list-page.html',
  styleUrl: './wards-list-page.scss'
})
export class WardsListPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly wards = signal<Ward[]>([]);
  protected readonly beds = signal<Bed[]>([]);
  protected readonly addOpen = signal(false);
  protected readonly editOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected readonly autoCreateBeds = signal(true);

  protected addForm: AddWardRequest = { wardName: '', wardType: 'GENERAL', totalBeds: 5 };
  protected editForm: UpdateWardRequest & { id?: number } = { wardName: '', wardType: 'GENERAL', totalBeds: 0 };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    forkJoin({ wards: this.adminApi.getAllWards(), beds: this.adminApi.getAllBeds() }).subscribe({
      next: ({ wards, beds }) => {
        this.wards.set(wards);
        this.beds.set(beds);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load wards.');
        this.loading.set(false);
      }
    });
  }

  protected bedCountForWard(wardId: number): number {
    return this.beds().filter(b => b.ward?.id === wardId).length;
  }

  protected availableBedsForWard(wardId: number): number {
    return this.beds().filter(b => b.ward?.id === wardId && b.status === 'AVAILABLE').length;
  }

  protected occupiedBedsForWard(wardId: number): number {
    return this.beds().filter(b => b.ward?.id === wardId && b.status === 'OCCUPIED').length;
  }

  protected capacityLeft(ward: Ward): number {
    return Math.max(0, ward.totalBeds - this.bedCountForWard(ward.id));
  }

  protected submitAdd(): void {
    const snapshot = { ...this.addForm };
    this.adminApi.addWard(snapshot).subscribe({
      next: msg => {
        if (!this.autoCreateBeds() || snapshot.totalBeds < 1) {
          this.addOpen.set(false);
          showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Ward added.');
          this.load();
          return;
        }
        this.adminApi.getAllWards().pipe(
          switchMap(wards => {
            const ward = wards.find(w => w.wardName === snapshot.wardName && w.wardType === snapshot.wardType);
            if (!ward) return forkJoin([]);
            const jobs = Array.from({ length: snapshot.totalBeds }, (_, i) =>
              this.adminApi.addBed({
                wardId: ward.id,
                bedNumber: `${snapshot.wardName.replace(/\s+/g, '')}-B${String(i + 1).padStart(2, '0')}`
              })
            );
            return forkJoin(jobs);
          })
        ).subscribe({
          next: () => {
            this.addOpen.set(false);
            showSnackbar(
              this.snackbarOpen,
              this.snackbarMessage,
              `${msg} Created ${snapshot.totalBeds} bed(s). You can now admit patients.`
            );
            this.load();
          },
          error: () => {
            this.addOpen.set(false);
            showSnackbar(this.snackbarOpen, this.snackbarMessage, `${msg} Ward added but auto-bed creation failed — add beds manually.`);
            this.load();
          }
        });
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Add failed.'))
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
      next: msg => {
        this.editOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Ward updated.');
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Update failed.'))
    });
  }

  protected deleteWard(id: number): void {
    if (!confirm('Delete ward? (Only if no beds exist)')) return;
    this.adminApi.deleteWard(id).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Ward deleted.');
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Delete failed.'))
    });
  }
}
