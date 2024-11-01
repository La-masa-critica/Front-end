import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private baseUrl = 'http://localhost:8082/api/v1/category'; 

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.baseUrl}/all`); 
  }
}