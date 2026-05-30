import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AdminApiService } from '../../../services/admin-api.service';
import { ChangePasswordRequest, UpdateProfileRequest, User } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { FileUploadComponent } from '../../../shared/ui/file-upload/file-upload';

@Component({
  selector: 'app-settings-account-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent, FileUploadComponent],
  templateUrl: './settings-account-page.html',
  styleUrl: './settings-account-page.scss'
})
export class SettingsAccountPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly profile = signal<User | null>(null);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected avatarUrl: string | null = null;
  protected profileForm: UpdateProfileRequest = { name: '', gender: 'MALE', age: 0, mobile: '' };
  protected passwordForm: ChangePasswordRequest = { oldPassword: '', newPassword: '' };

  constructor(private adminApi: AdminApiService, private auth: AuthService) {}

  ngOnInit(): void {
    const adminId = this.auth.getUserId();
    if (!adminId) {
      this.errorMsg.set('Admin user ID not found.');
      this.loading.set(false);
      return;
    }
    this.avatarUrl = localStorage.getItem(`hms_avatar_${adminId}`);
    this.adminApi.getAdminProfile(adminId).subscribe({
      next: user => {
        this.profile.set(user);
        this.profileForm = { name: user.name, gender: user.gender, age: user.age, mobile: user.mobile };
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load account.');
        this.loading.set(false);
      }
    });
  }

  protected onAvatar(file: { dataUrl: string }): void {
    const id = this.auth.getUserId();
    if (!id) return;
    this.avatarUrl = file.dataUrl;
    localStorage.setItem(`hms_avatar_${id}`, file.dataUrl);
    this.showSnackbar('Profile photo saved locally.');
  }

  protected saveProfile(): void {
    const adminId = this.auth.getUserId();
    if (!adminId) return;
    this.adminApi.updateAdminProfile(adminId, this.profileForm).subscribe({
      next: msg => this.showSnackbar(msg || 'Account updated.'),
      error: err => this.showSnackbar(String(err?.error ?? 'Update failed.'))
    });
  }

  protected changePassword(): void {
    const adminId = this.auth.getUserId();
    if (!adminId) return;
    this.adminApi.changePassword(adminId, this.passwordForm).subscribe({
      next: msg => {
        this.showSnackbar(msg || 'Password changed.');
        this.passwordForm = { oldPassword: '', newPassword: '' };
      },
      error: err => this.showSnackbar(String(err?.error ?? 'Password change failed.'))
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
