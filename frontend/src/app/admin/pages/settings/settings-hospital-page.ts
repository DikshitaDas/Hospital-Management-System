import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminApiService } from '../../../services/admin-api.service';
import { HospitalProfileRequest } from '../../models/admin.models';
import { SnackbarComponent } from '../../../shared/ui/snackbar/snackbar';
import { FileUploadComponent } from '../../../shared/ui/file-upload/file-upload';

@Component({
  selector: 'app-settings-hospital-page',
  standalone: true,
  imports: [FormsModule, SnackbarComponent, FileUploadComponent],
  templateUrl: './settings-hospital-page.html',
  styleUrl: './settings-hospital-page.scss'
})
export class SettingsHospitalPage implements OnInit {
  protected readonly loading = signal(true);
  protected readonly errorMsg = signal('');
  protected readonly snackbarOpen = signal(false);
  protected readonly snackbarMessage = signal('');
  protected form: HospitalProfileRequest = {
    hospitalName: '',
    address: '',
    phone: '',
    email: '',
    logoDataUrl: ''
  };

  constructor(private adminApi: AdminApiService) {}

  ngOnInit(): void {
    this.adminApi.getHospitalProfile().subscribe({
      next: p => {
        this.form = {
          hospitalName: p.hospitalName,
          address: p.address ?? '',
          phone: p.phone ?? '',
          email: p.email ?? '',
          logoDataUrl: p.logoDataUrl ?? ''
        };
        this.loading.set(false);
      },
      error: () => {
        this.errorMsg.set('Failed to load hospital profile.');
        this.loading.set(false);
      }
    });
  }

  protected onLogo(file: { dataUrl: string }): void {
    this.form.logoDataUrl = file.dataUrl;
  }

  protected save(): void {
    this.adminApi.updateHospitalProfile(this.form).subscribe({
      next: msg => this.showSnackbar(msg || 'Hospital profile saved.'),
      error: err => this.showSnackbar(String(err?.error ?? 'Save failed.'))
    });
  }

  protected showSnackbar(message: string): void {
    this.snackbarMessage.set(message);
    this.snackbarOpen.set(true);
    window.setTimeout(() => this.snackbarOpen.set(false), 3000);
  }
}
