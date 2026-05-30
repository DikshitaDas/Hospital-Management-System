import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { AddDoctorRequest, DoctorProfile, UpdateDoctorRequest } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-doctors-list-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent],
  templateUrl: './doctors-list-page.html',
  styleUrl: './doctors-list-page.scss'
})
export class DoctorsListPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly doctors = signal<DoctorProfile[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly addOpen = signal(false);
  protected readonly editOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected addForm: AddDoctorRequest = {
    name: '', gender: 'MALE', age: 0, mobile: '', password: '',
    specialization: '', department: '', consultationFee: 0, availability: 'MON-FRI 9-5'
  };
  protected editForm: UpdateDoctorRequest & { userId?: number } = {
    name: '', gender: 'MALE', age: 0, mobile: '',
    specialization: '', department: '', consultationFee: 0, availability: ''
  };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void { this.load(); }

  protected load(): void {
    this.loading.set(true);
    this.adminApi.getAllDoctors().subscribe({
      next: list => { this.doctors.set(list); this.loading.set(false); },
      error: () => { this.errorMsg.set('Failed to load doctors.'); this.loading.set(false); }
    });
  }

  protected onSearch(): void {
    const term = this.searchTerm().trim();
    this.loading.set(true);
    (term ? this.adminApi.searchDoctors(term) : this.adminApi.getAllDoctors()).subscribe({
      next: list => { this.doctors.set(list); this.loading.set(false); },
      error: () => { this.errorMsg.set('Search failed.'); this.loading.set(false); }
    });
  }

  protected openAdd(): void { this.addOpen.set(true); }

  protected submitAdd(): void {
    this.adminApi.addDoctor(this.addForm).subscribe({
      next: msg => { this.addOpen.set(false); this.showSnackbar(msg || 'Doctor added.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Add failed.')
    });
  }

  protected openEdit(d: DoctorProfile): void {
    this.editForm = {
      userId: d.user.id,
      name: d.user.name, gender: d.user.gender, age: d.user.age, mobile: d.user.mobile,
      specialization: d.specialization, department: d.department,
      consultationFee: d.consultationFee, availability: d.availability
    };
    this.editOpen.set(true);
  }

  protected submitEdit(): void {
    if (!this.editForm.userId) return;
    const { userId, ...body } = this.editForm;
    this.adminApi.updateDoctor(userId, body).subscribe({
      next: msg => { this.editOpen.set(false); this.showSnackbar(msg || 'Doctor updated.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Update failed.')
    });
  }

  protected deleteDoctor(userId: number): void {
    if (!confirm('Delete this doctor?')) return;
    this.adminApi.deleteDoctor(userId).subscribe({
      next: msg => { this.showSnackbar(msg || 'Doctor deleted.'); this.load(); },
      error: err => this.showSnackbar(err?.error ?? 'Delete failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
