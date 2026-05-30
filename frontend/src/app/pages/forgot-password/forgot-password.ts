import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPasswordComponent {
  uhid = '';
  mobile = '';
  newPassword = '';
  confirmPassword = '';
  loading = signal(false);
  errorMsg = signal('');
  successMsg = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) return;
    if (this.newPassword !== this.confirmPassword) {
      this.errorMsg.set('Passwords do not match.');
      return;
    }
    this.loading.set(true);
    this.errorMsg.set('');
    this.successMsg.set('');
    this.auth.forgotPassword({ uhid: this.uhid, mobile: this.mobile, newPassword: this.newPassword }).subscribe({
      next: msg => {
        this.loading.set(false);
        this.successMsg.set(msg);
        window.setTimeout(() => this.router.navigate(['/login']), 2500);
      },
      error: err => {
        this.loading.set(false);
        this.errorMsg.set(String(err?.error ?? 'Reset failed. Check UHID and mobile.'));
      }
    });
  }
}
