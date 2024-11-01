import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart } from './cart.model';
import { Sale } from './sale.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8082/api/v1';

  constructor(private http: HttpClient) {}

  addCart(cart: Cart): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/cart/add`, cart);
  }

  confirmSale(sale: Sale): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/sell/confirm`, sale);
  }
}