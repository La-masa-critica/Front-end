import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '@models/item.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly baseUrl = environment.itemApiUrl;

  constructor(private readonly http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getItems(): Observable<Item[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Item[]>(`${this.baseUrl}/all`, { headers });
  }

  createItem(item: Item): Observable<Item> {
    const headers = this.getAuthHeaders();
    return this.http.post<Item>(`${this.baseUrl}/new`, item, { headers });
  }

  getItemById(id: number): Observable<Item> {
    const headers = this.getAuthHeaders();
    return this.http.get<Item>(`${this.baseUrl}/${id}`, { headers });
  }

  filterItems(
    categoryIds?: number[],
    minPrice?: number,
    maxPrice?: number
  ): Observable<Item[]> {
    let params = new HttpParams();
    const headers = this.getAuthHeaders();

    // Agrega las categorías solo si `categoryIds` no está vacío
    if (categoryIds !== undefined) {
      if (categoryIds.length > 0) {
        categoryIds.forEach((id) => {
          params = params.append('categoryIds', id);
        });
      }
    }

    // Añade el precio mínimo si está definido
    if (minPrice !== undefined) {
      params = params.set('minPrice', minPrice.toString());
    }

    // Añade el precio máximo si está definido
    if (maxPrice !== undefined) {
      params = params.set('maxPrice', maxPrice.toString());
    }
    console.log(params);
    // Realiza la solicitud GET con los parámetros
    return this.http.get<Item[]>(`${this.baseUrl}/filter`, { headers, params });
  }
}
