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
    profileId: number;
    itemId: number;
    quantity: number;
  }>();

  constructor(private readonly http: HttpClient) {
    this.updateQuantitySubject
      .pipe(
        debounceTime(300), // Adjust the debounce time as needed
        switchMap(({ profileId, itemId, quantity }) =>
          this.updateCartQuantity(profileId, itemId, quantity)
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

  addCart(cartId: number, itemId: number, quantity: number): Observable<Cart> {
    const body = {
      cartId: cartId,
      itemId: itemId,
      quantity: quantity,
    };
    const headers = this.getAuthHeaders();
    return this.http.post<Cart>(`${this.apiUrl}/add`, body, { headers });
  }

  emptyCart(profileId: number): Observable<void> {
    const params = { profileId: profileId };
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}/clear`, { headers, params });
  }

  removeFromCart(profileId: number, itemId: number): Observable<Cart> {
    const params = { profileId: profileId, itemId: itemId };
    const headers = this.getAuthHeaders();
    return this.http.delete<Cart>(`${this.apiUrl}/delete`, { headers, params });
  }

  getCartByProfileId(profileId: number): Observable<Cart> {
    const url = `${this.apiUrl}/${profileId}`;
    const headers = this.getAuthHeaders();
    return this.http.get<Cart>(url, { headers });
  }

  updateCartQuantity(
    profileId: number,
    itemId: number,
    quantity: number
  ): Observable<Cart> {
    if (quantity < 0) {
      return of({ id: profileId, items: [], enabled: true } as Cart);
    }

    const headers = this.getAuthHeaders();
    const params = new HttpParams()
      .set('profileId', profileId)
      .set('itemId', itemId)
      .set('quantity', quantity);

    return this.http.put<Cart>(`${this.apiUrl}/update`, null, { headers, params });
  }

  queueUpdateCartQuantity(
    profileId: number,
    itemId: number,
    quantity: number
  ): void {
    this.updateQuantitySubject.next({ profileId, itemId, quantity });
  }

  increaseQuantity(
    profileId: number,
    item: { itemId: number; quantity: number }
  ): Observable<Cart> {
    item.quantity += 1;
    return this.updateCartQuantity(profileId, item.itemId, item.quantity);
  }

  decreaseQuantity(
    profileId: number,
    item: { itemId: number; quantity: number }
  ): Observable<Cart> {
    if (!item || item.quantity <= 0) {
      return of({ id: profileId, items: [], enabled: true } as Cart);
    }
    item.quantity -= 1;
    return this.updateCartQuantity(profileId, item.itemId, item.quantity);
  }
}
