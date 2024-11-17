import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Item } from '../models/item.model';
// import { Category } from './category.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ItemService {
  private readonly baseUrl = environment.itemApiUrl;

  constructor(private readonly http: HttpClient) {}

  getItems(): Observable<Item[]> {
    return this.http.get<Item[]>(`${this.baseUrl}/all`);
  }

  createItem(item: Item): Observable<Item> {
    return this.http.post<Item>(`${this.baseUrl}/new`, item);
  }

  getItemById(id: number): Observable<Item> {
    return this.http.get<Item>(`${this.baseUrl}/${id}`);
  }

  filterItems(
    categoryIds?: number[],
    minPrice?: number,
    maxPrice?: number
  ): Observable<Item[]> {
    let params = new HttpParams();

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
    return this.http.get<Item[]>(`${this.baseUrl}/filter`, { params });
  }
}
