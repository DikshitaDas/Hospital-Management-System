import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { Department, DepartmentRequest } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-departments-master-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent],
  templateUrl: './departments-master-page.html',
  styleUrl: './departments-master-page.scss'
})
export class DepartmentsMasterPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly items = signal<Department[]>([]);
  protected readonly addOpen = signal(false);
  protected readonly editOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected addForm: DepartmentRequest = { name: '', description: '' };
  protected editForm: DepartmentRequest & { id?: number } = { name: '', description: '' };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllDepartments().subscribe({
      next: list => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load departments.');
        this.loading.set(false);
      }
    });
  }

  protected openAdd(): void {
    this.addForm = { name: '', description: '' };
    this.addOpen.set(true);
  }

  protected submitAdd(): void {
    this.adminApi.addDepartment(this.addForm).subscribe({
      next: msg => {
        this.addOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg);
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Add failed.'))
    });
  }

  protected openEdit(d: Department): void {
    this.editForm = { id: d.id, name: d.name, description: d.description ?? '' };
    this.editOpen.set(true);
  }

  protected submitEdit(): void {
    if (!this.editForm.id) return;
    const { id, ...body } = this.editForm;
    this.adminApi.updateDepartment(id, body).subscribe({
      next: msg => {
        this.editOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg);
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Update failed.'))
    });
  }

  protected deleteItem(id: number): void {
    if (!confirm('Delete this department?')) return;
    this.adminApi.deleteDepartment(id).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg);
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Delete failed.'))
    });
  }
}
