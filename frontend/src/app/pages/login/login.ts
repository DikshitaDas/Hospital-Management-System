import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  uhid = '';
  password = '';
  showPassword = false;
  loading = signal(false);
  errorMsg = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.loading.set(true);
    this.errorMsg.set('');

    this.auth.login({ uhid: this.uhid, password: this.password }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (!res.token) {
          this.errorMsg.set(res.message || 'Login failed. Please try again.');
          return;
        }
        const role = res.role?.toUpperCase();
        if (role === 'ADMIN') this.router.navigate(['/admin/dashboard']);
        else if (role === 'DOCTOR') this.router.navigate(['/doctor/dashboard']);
        else this.router.navigate(['/patient/dashboard']);
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Something went wrong. Please try again.');
      }
    });
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
