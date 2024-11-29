import { Component } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Login } from '@app/models/login.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class LoginComponent {
  credentials: Login = { username: '', password: '' };
  errorMessage = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  login(): void {
    this.authService.login(this.credentials).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.errorMessage = 'Login failed'
    });
  }

  register(): void {
    this.router.navigate(['/register']); // Navega a la página de registro
  }

}
