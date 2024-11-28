import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

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

  async isLoggedIn(): Promise<boolean> {
    const headers = this.getAuthHeaders();
    let loggedIn =false;
    await this.http.get<any>("http://localhost:8080/api/v1/item/all", { headers }).toPromise()
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

  register(register: Registro): Observable<any> {
    return this.http.post<any>(this.apiUrl+"register", register).pipe(
      tap(response => {
        localStorage.setItem('token', response.token);
      })
    );
  }

}