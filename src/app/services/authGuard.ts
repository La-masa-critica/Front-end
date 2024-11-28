import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { authService } from './authService';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: authService, private router: Router) {}

  async canActivate(): Promise<boolean> {
    let loggedIn = await this.authService.isLoggedIn();
    if (loggedIn) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}