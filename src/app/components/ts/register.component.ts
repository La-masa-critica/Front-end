import { Component } from '@angular/core';
import { authService } from '@app/services/authService';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Registro } from '@app/models/registro';

@Component({
  selector: 'app-register',
  templateUrl: '../html/registroComponent.html', // Update the template URL
  imports: [FormsModule, CommonModule], 
  standalone: true
})
export class registerComponent {
  registro: Registro = { username: "", password: "", name: "", email: "", phone: "" }; 
  errorMessage = '';

  constructor(private authService: authService, private router: Router) {}

  register(): void {
    this.authService.register(this.registro).subscribe({
      next: () => this.router.navigate(['/']),
      error: err => this.errorMessage = 'Registration failed'
    });
  }

  login(): void {
    this.router.navigate(['/login']); // Navigate to the login page
  }
}