import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss'
})
export class RegisterComponent {
  name = '';
  gender = '';
  age: number | null = null;
  mobile = '';
  password = '';
  confirmPassword = '';
  showPassword = false;

  loading = signal(false);
  errorMsg = signal('');
  successUhid = signal('');
  copied = signal(false);

  constructor(private auth: AuthService, private router: Router) {}

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    if (this.password !== this.confirmPassword) {
      this.errorMsg.set('Passwords do not match.');
      return;
    }

    this.loading.set(true);
    this.errorMsg.set('');
    this.successUhid.set('');

    this.auth.register({
      name: this.name,
      gender: this.gender,
      age: this.age!,
      mobile: this.mobile,
      password: this.password
    }).subscribe({
      next: (res) => {
        this.loading.set(false);
        if (res.toLowerCase().includes('already')) {
          this.errorMsg.set(res);
          return;
        }
        // Extract UHID from response string e.g. "Patient Registered Successfully! UHID: HMS123456"
        const match = res.match(/HMS\d+/);
        this.successUhid.set(match ? match[0] : res);
      },
      error: () => {
        this.loading.set(false);
        this.errorMsg.set('Registration failed. Please try again.');
      }
    });
  }

  copyUhid() {
    navigator.clipboard.writeText(this.successUhid()).then(() => {
      this.copied.set(true);
      setTimeout(() => this.copied.set(false), 2000);
    });
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }
}
