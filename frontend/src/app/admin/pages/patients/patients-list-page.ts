import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '../../../services/admin-api.service';
import { CreateUserRequest, UpdatePatientRequest, User } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { statusBadgeClass } from '../page.util';

@Component({
  selector: 'app-patients-list-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent],
  templateUrl: './patients-list-page.html',
  styleUrl: './patients-list-page.scss'
})
export class PatientsListPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly patients = signal<User[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly addOpen = signal(false);
  protected readonly editOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected addForm: CreateUserRequest = { name: '', gender: 'MALE', age: 0, mobile: '', role: 'PATIENT', password: '' };
  protected editForm: UpdatePatientRequest & { id?: number } = { name: '', gender: 'MALE', age: 0, mobile: '' };
  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const search = params['search'] as string | undefined;
      if (search?.trim()) {
        this.searchTerm.set(search.trim());
        this.loadSearch(search.trim());
      } else {
        this.loadPatients();
      }
    });
  }

  protected loadPatients(): void {
    this.loading.set(true);
    this.errorMsg.set('');
    this.adminApi.getAllPatients().subscribe({
      next: list => {
        this.patients.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load patients.');
        this.loading.set(false);
      }
    });
  }

  protected loadSearch(name: string): void {
    this.loading.set(true);
    this.adminApi.searchPatients(name).subscribe({
      next: list => {
        this.patients.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Search failed.');
        this.loading.set(false);
      }
    });
  }

  protected onSearch(): void {
    const term = this.searchTerm().trim();
    if (term) this.loadSearch(term);
    else this.loadPatients();
  }

  protected openAdd(): void {
    this.addForm = { name: '', gender: 'MALE', age: 0, mobile: '', role: 'PATIENT', password: '' };
    this.addOpen.set(true);
  }

  protected submitAdd(): void {
    this.adminApi.createUser(this.addForm).subscribe({
      next: msg => {
        this.addOpen.set(false);
        this.showSnackbar(msg || 'Patient created.');
        this.loadPatients();
      },
      error: err => this.showSnackbar(err?.error ?? 'Failed to create patient.')
    });
  }

  protected openEdit(p: User): void {
    this.editForm = { id: p.id, name: p.name, gender: p.gender, age: p.age, mobile: p.mobile };
    this.editOpen.set(true);
  }

  protected submitEdit(): void {
    if (!this.editForm.id) return;
    const { id, ...body } = this.editForm;
    this.adminApi.updatePatient(id, body).subscribe({
      next: msg => {
        this.editOpen.set(false);
        this.showSnackbar(msg || 'Patient updated.');
        this.loadPatients();
      },
      error: err => this.showSnackbar(err?.error ?? 'Update failed.')
    });
  }

  protected deletePatient(id: number): void {
    if (!confirm('Delete this patient?')) return;
    this.adminApi.deletePatient(id).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Patient deleted.');
        this.loadPatients();
      },
      error: err => this.showSnackbar(err?.error ?? 'Delete failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
