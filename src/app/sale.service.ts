import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, of, Subject } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Cart } from './cart.model';
import { Sale } from './sale.model';
import { environment } from '../envitoment';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly apiUrl = environment.apiUrl;
  private readonly updateQuantitySubject = new Subject<{ profileId: number, itemId: number, quantity: number }>();
  private updateTimes = 0;

  constructor(private readonly http: HttpClient) {
    this.updateQuantitySubject.pipe(
      debounceTime(300), // Adjust the debounce time as needed
      switchMap(({ profileId, itemId, quantity }) =>
        this.updateCartQuantity(profileId, itemId, quantity)
      )
    ).subscribe();
  }

  addCart(cartId: number, itemId: number, quantity: number): Observable<Cart> {
    const body = {
      cartId: cartId,
      itemId: itemId,
      quantity: quantity,
    };
    console.log(body);
    return this.http.post<Cart>(`${this.apiUrl}/cart/add`, body);
  }

  removeFromCart(profileId: number, itemId: number): Observable<Cart> {
    const params = { profileId: profileId, itemId: itemId };
    return this.http.delete<Cart>(`${this.apiUrl}/cart/delete`, { params });
  }

  getCartByProfileId(profileId: number): Observable<Cart> {
    const url = `${this.apiUrl}/cart/${profileId}`;
    return this.http.get<Cart>(url);
  }

  updateCartQuantity(
    profileId: number,
    itemId: number,
    quantity: number
  ): Observable<Cart> {
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
    return this.http.put<Cart>(`${this.apiUrl}/cart/update`, null, {
      headers,
      params,
    });
  }

  queueUpdateCartQuantity(profileId: number, itemId: number, quantity: number): void {
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
    if (item.quantity < 1) {
      return of({ id: profileId, items: [] } as Cart);
    }
    item.quantity -= 1;
    return this.updateCartQuantity(profileId, item.itemId, item.quantity);
  }

  checkout(cartId: number): Observable<Sale> {
    const params = new HttpParams().set('cartId', cartId);
    return this.http.post<Sale>(
      `${this.apiUrl}/sale/checkout`,
      {},
      { params }
    );
  }

  confirmSale(saleId: number | undefined): Observable<Sale> {
    if (saleId == undefined) {
      throw new Error('The saleId cannot be undefined');
    }
    const params = new HttpParams().set('saleId', saleId);
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.put<Sale>(`${this.apiUrl}/sale/confirm`, null, {
      headers,
      params,
    });
  }

  cancelSale(saleId: number | undefined): Observable<Sale> {
    if (saleId == undefined) {
      throw new Error('The saleId cannot be undefined');
    }
    const params = new HttpParams().set('saleId', saleId);
    const headers = new HttpHeaders({
      Accept: 'aaplication/json',
    });

    return this.http.put<Sale>(`${this.apiUrl}/sale/cancel`, null, {
      headers,
      params,
    });
  }
}
