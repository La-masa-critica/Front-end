import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Cart } from '../models/cart.model';
import { environment } from '../../environments/environment';

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
  private updateTimes = 0;

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

  addCart(cartId: number, itemId: number, quantity: number): Observable<Cart> {
    const body = {
      cartId: cartId,
      itemId: itemId,
      quantity: quantity,
    };
    console.log(body);
    return this.http.post<Cart>(`${this.apiUrl}/add`, body);
  }

  clearCart(profileId: number): Observable<void> {
    const params = { profileId: profileId };
    return this.http.delete<void>(`${this.apiUrl}/clear`, { params });
  }

  removeFromCart(profileId: number, itemId: number): Observable<Cart> {
    const params = { profileId: profileId, itemId: itemId };
    return this.http.delete<Cart>(`${this.apiUrl}/delete`, { params });
  }

  getCartByProfileId(profileId: number): Observable<Cart> {
    const url = `${this.apiUrl}/${profileId}`;
    return this.http.get<Cart>(url);
  }

  updateCartQuantity(
    profileId: number,
    itemId: number,
    quantity: number
  ): Observable<Cart> {
    if (quantity < 0) {
      return of({ id: profileId, items: [], enabled: true } as Cart);
    }

    const headers = new HttpHeaders({
      Accept: 'application/json',
    });
    // Parámetros de consulta
    const params = new HttpParams()
      .set('profileId', profileId)
      .set('itemId', itemId)
      .set('quantity', quantity);

    console.log('Updating cart quantity:', params.toString());
    console.log('Update times:', this.updateTimes++);

    // Realizar la solicitud PUT
    return this.http.put<Cart>(`${this.apiUrl}/update`, null, {
      headers,
      params,
    });
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
