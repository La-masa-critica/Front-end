import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Registro } from '@app/models/registro.model';
import { AuthResponse } from '@app/models/auth-response.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = environment.authApiUrl;

  constructor(private readonly http: HttpClient, private readonly router: Router) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  login(credentials: { username: string; password: string }): Observable<AuthResponse> {
    return this.http.post<any>(this.apiUrl + '/login', credentials).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        environment.currtentUser = response.profile;
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }

  async isLoggedIn(): Promise<boolean> {
    const headers = this.getAuthHeaders();
    let loggedIn = false;
    await this.http
      .get<any>(`${environment.itemApiUrl}/all`, { headers })
      .toPromise()
      .then(() => {
        loggedIn = true;
      })
      .catch((err: any) => {
        if ([401, 403].includes(err.status)) {
          // auto logout if 401 or 403 response returned from api
          loggedIn = false;
          this.logout();
        }
      });
    return loggedIn;
  }

  register(register: Registro): Observable<AuthResponse> {
    return this.http.post<any>(this.apiUrl + '/register', register).pipe(
      tap((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('role', response.role);
        environment.currtentUser = response.profile;
      })
    );
  }
}
