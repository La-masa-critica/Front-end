import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Cart } from '@models/cart.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly apiUrl = environment.cartApiUrl;
  private readonly updateQuantitySubject = new Subject<{
    itemId: number;
    quantity: number;
  }>();

  constructor(private readonly http: HttpClient) {
    this.updateQuantitySubject
      .pipe(
        debounceTime(300),
        switchMap(({itemId, quantity }) =>
          this.updateCartQuantity(itemId, quantity)
        )
      )
      .subscribe();
  }

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  addCart(itemId: number, quantity: number): Observable<Cart> {
    const body = {
      itemId: itemId,
      quantity: quantity,
    };
    const headers = this.getAuthHeaders();
    return this.http.post<Cart>(`${this.apiUrl}/add`, body, { headers });
  }

  emptyCart(): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/clear`, { headers });
  }

  removeFromCart(itemId: number): Observable<Cart> {
    const params = {itemId: itemId };
    const headers = this.getAuthHeaders();
    return this.http.delete<Cart>(`${this.apiUrl}/delete`, { headers, params });
  }

  getCartByProfileId(): Observable<Cart> {
    const url = `${this.apiUrl}`;
    const headers = this.getAuthHeaders();
    return this.http.get<Cart>(url, { headers });
  }

  updateCartQuantity(
    itemId: number,
    quantity: number
  ): Observable<Cart> {
    if (quantity < 0) {
      return of({ id: 0, items: [], enabled: true } as Cart);
    }

    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('itemId', itemId)
      .set('quantity', quantity);

    return this.http.put<Cart>(`${this.apiUrl}/update`, null, { headers, params });
  }

  queueUpdateCartQuantity(
    itemId: number,
    quantity: number
  ): void {
    this.updateQuantitySubject.next({itemId, quantity });
  }

  increaseQuantity(
    item: { itemId: number; quantity: number }
  ): Observable<Cart> {
    item.quantity += 1;
    return this.updateCartQuantity(item.itemId, item.quantity);
  }

  decreaseQuantity(
    item: { itemId: number; quantity: number }
  ): Observable<Cart> {
    if (!item || item.quantity <= 0) {
      return of({id: 0, items: [], enabled: true } as Cart);
    }
    item.quantity -= 1;
    return this.updateCartQuantity( item.itemId, item.quantity);
  }
}
