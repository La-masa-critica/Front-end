import { Component } from '@angular/core';
import { authService } from '@app/services/authService';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: '../html/loginComponent.html',
  imports: [FormsModule, CommonModule], 
  standalone: true
})
export class loginComponent {
  credentials = { username: '', password: '' }; 
  errorMessage = '';

  constructor(private authService: authService, private router: Router) {}

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