import { Component } from '@angular/core';
import { AuthService } from '@app/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Registro } from '@app/models/registro.model';

@Component({
  selector: 'app-register',
  templateUrl: 'signup.component.html', // Update the template URL
  imports: [FormsModule, CommonModule],
  standalone: true
})
export class RegisterComponent {
  registro: Registro = { username: "", password: "", name: "", email: "", phone: "" };
  errorMessage = '';

  constructor(private readonly authService: AuthService, private readonly router: Router) {}

  register(): void {
    this.authService.register(this.registro).subscribe({
      next: () => this.router.navigate(['']),
      error: err => this.errorMessage = 'Registration failed'
    });
  }

  login(): void {
    this.router.navigate(['/login']); // Navigate to the login page
  }
}
