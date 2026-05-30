import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { AdminApiService } from '../../../services/admin-api.service';
import { UpdateRoleRequest, User } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-settings-roles-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './settings-roles-page.html',
  styleUrl: './settings-roles-page.scss'
})
export class SettingsRolesPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly users = signal<User[]>([]);
  protected readonly roleFilter = signal('ALL');
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void { this.loadAll(); }

  protected loadAll(): void {
    this.loading.set(true);
    forkJoin({
      admins: this.adminApi.getUsersByRole('ADMIN'),
      doctors: this.adminApi.getUsersByRole('DOCTOR'),
      patients: this.adminApi.getUsersByRole('PATIENT')
    }).subscribe({
      next: ({ admins, doctors, patients }) => {
        this.users.set([...admins, ...doctors, ...patients]);
        this.loading.set(false);
      },
      error: () => { this.errorMsg.set('Failed to load users.'); this.loading.set(false); }
    });
  }

  protected filtered(): User[] {
    const f = this.roleFilter();
    return f === 'ALL' ? this.users() : this.users().filter(u => u.role.toUpperCase() === f);
  }

  protected updateRole(user: User, role: string): void {
    const body: UpdateRoleRequest = { role };
    this.adminApi.updateUserRole(user.id, body).subscribe({
      next: msg => { this.showSnackbar(msg || 'Role updated.'); this.loadAll(); },
      error: err => this.showSnackbar(err?.error ?? 'Role update failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
