import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Registro } from '@app/models/registro';

@Injectable({
  providedIn: 'root'
})
export class authService {
  private apiUrl = 'http://localhost:8080/api/v1/auth/'; // URL del endpoint de login

  constructor(private http: HttpClient, private router: Router) {}

  login(credentials: { username: string, password: string }): Observable<any> {
    return this.http.post<any>(this.apiUrl+"login", credentials).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token');
  }

  register(register: Registro): Observable<any> {
    return this.http.post<any>(this.apiUrl+"register", register).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

}