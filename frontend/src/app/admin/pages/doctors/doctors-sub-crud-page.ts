import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AdminApiService } from '../../../services/admin-api.service';
import { AddDoctorRequest, DoctorProfile, UpdateDoctorRequest } from '../../models/admin.models';
import { ModalComponent } from '../../../shared/ui/modal/modal';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { TooltipDirective } from '../../../shared/directives/tooltip.directive';
import { showSnackbar, statusBadgeClass } from '../page.util';

type SubMode = 'department' | 'schedule' | 'specialization';

@Component({
  selector: 'app-doctors-sub-crud-page',
  standalone: true,
  imports: [FormsModule, ModalComponent, SnackbarComponent, TooltipDirective],
  templateUrl: './doctors-sub-crud-page.html',
  styleUrl: './doctors-sub-crud-page.scss'
})
export class DoctorsSubCrudPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly doctors = signal<DoctorProfile[]>([]);
  protected readonly searchTerm = signal('');
  protected readonly addOpen = signal(false);
  protected readonly editOpen = signal(false);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  protected mode: SubMode = 'department';
  protected pageTitle = 'Departments';
  protected fieldLabel = 'Department';
  protected fieldKey: 'department' | 'availability' | 'specialization' = 'department';

  protected addForm: AddDoctorRequest = {
    name: '', gender: 'MALE', age: 30, mobile: '', password: '',
    specialization: '', department: '', consultationFee: 500, availability: 'MON-FRI 9-5'
  };
  protected editForm: UpdateDoctorRequest & { userId?: number } = {
    name: '', gender: 'MALE', age: 30, mobile: '',
    specialization: '', department: '', consultationFee: 500, availability: ''
  };

  protected readonly badgeClass = statusBadgeClass;

  constructor(private adminApi: AdminApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const mode = this.route.snapshot.data['mode'] as SubMode;
    this.mode = mode ?? 'department';
    if (this.mode === 'schedule') {
      this.pageTitle = 'Doctor Schedule';
      this.fieldLabel = 'Availability';
      this.fieldKey = 'availability';
    } else if (this.mode === 'specialization') {
      this.pageTitle = 'Specialization';
      this.fieldLabel = 'Specialization';
      this.fieldKey = 'specialization';
    } else {
      this.pageTitle = 'Departments';
      this.fieldLabel = 'Department';
      this.fieldKey = 'department';
    }
    this.load();
  }

  protected load(): void {
    this.loading.set(true);
    const term = this.searchTerm().trim();
    (term ? this.adminApi.searchDoctors(term) : this.adminApi.getAllDoctors()).subscribe({
      next: list => {
        this.doctors.set(list);
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load doctors.');
        this.loading.set(false);
      }
    });
  }

  protected grouped(): Record<string, DoctorProfile[]> {
    const map: Record<string, DoctorProfile[]> = {};
    for (const d of this.doctors()) {
      const key = String(d[this.fieldKey] ?? 'Unassigned');
      (map[key] ??= []).push(d);
    }
    return map;
  }

  protected groupKeys(): string[] {
    return Object.keys(this.grouped()).sort();
  }

  protected openAdd(prefill = ''): void {
    if (prefill) {
      if (this.fieldKey === 'department') this.addForm.department = prefill;
      if (this.fieldKey === 'specialization') this.addForm.specialization = prefill;
      if (this.fieldKey === 'availability') this.addForm.availability = prefill;
    }
    this.addOpen.set(true);
  }

  protected submitAdd(): void {
    this.adminApi.addDoctor(this.addForm).subscribe({
      next: msg => {
        this.addOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Doctor added.');
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Add failed.'))
    });
  }

  protected openEdit(d: DoctorProfile): void {
    this.editForm = {
      userId: d.user.id,
      name: d.user.name,
      gender: d.user.gender,
      age: d.user.age,
      mobile: d.user.mobile,
      specialization: d.specialization,
      department: d.department,
      consultationFee: d.consultationFee,
      availability: d.availability
    };
    this.editOpen.set(true);
  }

  protected submitEdit(): void {
    if (!this.editForm.userId) return;
    const { userId, ...body } = this.editForm;
    this.adminApi.updateDoctor(userId, body).subscribe({
      next: msg => {
        this.editOpen.set(false);
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Doctor updated.');
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Update failed.'))
    });
  }

  protected deleteDoctor(userId: number): void {
    if (!confirm('Delete this doctor?')) return;
    this.adminApi.deleteDoctor(userId).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Doctor deleted.');
        this.load();
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Delete failed.'))
    });
  }
}
