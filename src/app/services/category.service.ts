import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '@models/category.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private readonly baseUrl = environment.categoryApiUrl;

  constructor(private readonly http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getCategories(): Observable<Category[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Category[]>(`${this.baseUrl}/all`, { headers });
  }
}
