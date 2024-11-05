import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cart, CartItem } from './cart.model';
import { Sale } from './sale.model';
import { Checkout } from './checkout.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private apiUrl = 'http://localhost:8081/api/v1';

  constructor(private http: HttpClient) {}

  addCart(cartId: number, itemId: number, quantity: number): Observable<Cart> {
    const body = {
      cartId: cartId,
      itemId: itemId,
      quantity: quantity
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

  updateCartQuantity(profileId: number, itemId: number, quantity: number): Observable<CartItem> {
    const headers = new HttpHeaders({
      'Accept': '/'
    });
    console.log("Yo estuve aqui");
    // Parámetros de consulta
    const params = new HttpParams()
      .set('profileId', profileId)
      .set('itemId', itemId)
      .set('quantity', quantity);

    // Realizar la solicitud PUT
    return this.http.put<CartItem>(`${this.apiUrl}/cart/update`, null, { headers, params });
  }

  checkout(cartId: number): Observable<Checkout> {
    const params = new HttpParams().set('cartId', cartId);
    return this.http.post<Checkout>(`${this.apiUrl}/sale/checkout`, {}, { params });
  }

  confirmSale(saleId: number): Observable<Checkout> {
    const params = new HttpParams().set('saleId', saleId.toString());
    
    return this.http.put<Checkout>(`${this.apiUrl}/sale/confirm`, { params });
  }

  cancelSale(saleId: number): Observable<Checkout> {
    const params = new HttpParams().set('saleId', saleId.toString());
    
    return this.http.put<Checkout>(`${this.apiUrl}/sale/cancel`, { params });
  }
}
