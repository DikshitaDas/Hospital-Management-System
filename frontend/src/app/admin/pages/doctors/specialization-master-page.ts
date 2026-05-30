import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import {
  Department,
  Specialization,
  SpecializationRequest
} from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-specialization-master-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent],
  templateUrl: './specialization-master-page.html',
  styleUrl: './specialization-master-page.scss'
})
export class SpecializationMasterPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly items = signal<Specialization[]>([]);
  protected readonly departments = signal<Department[]>([]);
  protected readonly addOpen = signal(false);
  protected readonly editOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected addForm: SpecializationRequest = { name: '', departmentId: undefined };
  protected editForm: SpecializationRequest & { id?: number } = { name: '', departmentId: undefined };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    forkJoin({
      items: this.adminApi.getAllSpecializations(),
      departments: this.adminApi.getAllDepartments()
    }).subscribe({
      next: ({ items, departments }) => {
        this.items.set(items);
        this.departments.set(departments);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load specializations.');
        this.loading.set(false);
      }
    });
  }

  protected deptName(s: Specialization): string {
    return s.department?.name ?? '—';
  }

  protected openAdd(): void {
    this.addForm = { name: '', departmentId: undefined };
    this.addOpen.set(true);
  }

  protected submitAdd(): void {
    const body: SpecializationRequest = {
      name: this.addForm.name,
      departmentId: this.addForm.departmentId || undefined
    };
    this.adminApi.addSpecialization(body).subscribe({
      next: msg => {
        this.addOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg);
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Add failed.'))
    });
  }

  protected openEdit(s: Specialization): void {
    this.editForm = {
      id: s.id,
      name: s.name,
      departmentId: s.department?.id
    };
    this.editOpen.set(true);
  }

  protected submitEdit(): void {
    if (!this.editForm.id) return;
    const { id, ...rest } = this.editForm;
    const body: SpecializationRequest = {
      name: rest.name,
      departmentId: rest.departmentId || undefined
    };
    this.adminApi.updateSpecialization(id, body).subscribe({
      next: msg => {
        this.editOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg);
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Update failed.'))
    });
  }

  protected deleteItem(id: number): void {
    if (!confirm('Delete this specialization?')) return;
    this.adminApi.deleteSpecialization(id).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg);
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Delete failed.'))
    });
  }
}
