import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { ChangePasswordRequest, UpdateProfileRequest, User } from '../../../admin/models/admin.models';
import { PatientApiService } from '../../../services/patient-api.service';
import { FileUploadComponent } from '../../../shared/ui/file-upload/file-upload';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { showSnackbar } from '../page.util';

@Component({
  selector: 'app-patient-profile-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent, FileUploadComponent],
  templateUrl: './profile-page.html',
  styleUrl: './profile-page.scss'
})
export class PatientProfilePage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly profile = signal<User | null>(null);
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected avatarUrl: string | null = null;

  protected profileForm: UpdateProfileRequest = { name: '', gender: 'MALE', age: 0, mobile: '' };
  protected passwordForm: ChangePasswordRequest = { oldPassword: '', newPassword: '' };

  private readonly patientId: number | null;

  constructor(private patientApi: PatientApiService, private auth: AuthService) {
    this.patientId = auth.getUserId();
  }

  ngOnInit(): void {
    if (!this.patientId) {
      this.errorMsg.set('Session expired.');
      this.loading.set(false);
      return;
    }
    this.avatarUrl = localStorage.getItem(`hms_avatar_${this.patientId}`);
    this.patientApi.getProfile().subscribe({
      next: user => {
        this.profile.set(user);
        this.profileForm = { name: user.name, gender: user.gender, age: user.age, mobile: user.mobile };
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load profile.');
        this.loading.set(false);
      }
    });
  }

  protected onAvatar(file: { dataUrl: string }): void {
    if (!this.patientId) return;
    this.avatarUrl = file.dataUrl;
    localStorage.setItem(`hms_avatar_${this.patientId}`, file.dataUrl);
    showSnackbar(this.snackbarOpen, this.snackbarMessage, 'Profile photo saved locally.');
  }

  protected saveProfile(): void {
    if (!this.patientId) return;
    this.patientApi.updateProfile(this.patientId, this.profileForm).subscribe({
      next: msg => showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Profile updated.'),
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Update failed.'))
    });
  }

  protected changePassword(): void {
    if (!this.patientId) return;
    this.patientApi.changePassword(this.patientId, this.passwordForm).subscribe({
      next: msg => {
        showSnackbar(this.snackbarOpen, this.snackbarMessage, msg || 'Password changed.');
        this.passwordForm = { oldPassword: '', newPassword: '' };
      },
      error: err => showSnackbar(this.snackbarOpen, this.snackbarMessage, String(err?.error ?? 'Password change failed.'))
    });
  }
}
