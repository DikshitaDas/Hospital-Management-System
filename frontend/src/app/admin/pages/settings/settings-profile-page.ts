import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AdminApiService } from '../../../services/admin-api.service';
import { ChangePasswordRequest, UpdateProfileRequest, User } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';

@Component({
  selector: 'app-settings-profile-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent],
  templateUrl: './settings-profile-page.html',
  styleUrl: './settings-profile-page.scss'
})
export class SettingsProfilePage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly profile = signal<User | null>(null);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected profileForm: UpdateProfileRequest = { name: '', gender: 'MALE', age: 0, mobile: '' };
  protected passwordForm: ChangePasswordRequest = { oldPassword: '', newPassword: '' };

  constructor(private adminApi: AdminApiService, private auth: AuthService) {}

  ngOnInit(): void {
    const adminId = this.auth.getUserId();
    if (!adminId) { this.errorMsg.set('Admin user ID not found.'); this.loading.set(false); return; }
    this.adminApi.getAdminProfile(adminId).subscribe({
      next: user => {
        this.profile.set(user);
        this.profileForm = { name: user.name, gender: user.gender, age: user.age, mobile: user.mobile };
        this.loading.set(false);
      },
      error: () => { this.errorMsg.set('Failed to load profile.'); this.loading.set(false); }
    });
  }

  protected saveProfile(): void {
    const adminId = this.auth.getUserId();
    if (!adminId) return;
    this.adminApi.updateAdminProfile(adminId, this.profileForm).subscribe({
      next: msg => this.showSnackbar(msg || 'Profile updated.'),
      error: err => this.showSnackbar(err?.error ?? 'Update failed.')
    });
  }

  protected changePassword(): void {
    const adminId = this.auth.getUserId();
    if (!adminId) return;
    this.adminApi.changePassword(adminId, this.passwordForm).subscribe({
      next: msg => { this.showSnackbar(msg || 'Password changed.'); this.passwordForm = { oldPassword: '', newPassword: '' }; },
      error: err => this.showSnackbar(err?.error ?? 'Password change failed.')
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
