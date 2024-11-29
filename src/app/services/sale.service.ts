import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Sale } from '@models/sale.model';
import { Cart } from '@models/cart.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly apiUrl = environment.saleApiUrl;
  private readonly updateQuantitySubject = new Subject<{
    itemId: number;
    quantity: number;
  }>();
  constructor(private readonly http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      Accept: 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  checkout(): Observable<Sale> {
    const headers = this.getAuthHeaders();
    return this.http.post<Sale>(`${this.apiUrl}/checkout`, {}, { headers });
  }

  confirmSale(saleId: number | undefined): Observable<Sale> {
    if (saleId == undefined) {
      throw new Error('The saleId cannot be undefined');
    }
    const params = new HttpParams().set('saleId', saleId);
    const headers = this.getAuthHeaders();
    return this.http.put<Sale>(`${this.apiUrl}/confirm`, null, { headers, params });
  }

  cancelSale(saleId: number | undefined): Observable<Sale> {
    if (saleId == undefined) {
      throw new Error('The saleId cannot be undefined');
    }
    const params = new HttpParams().set('saleId', saleId);
    const headers = this.getAuthHeaders();
    return this.http.put<Sale>(`${this.apiUrl}/cancel`, null, { headers, params });
  }

  failSale(saleId: number | undefined): Observable<Cart> {
    if (saleId == undefined) {
      throw new Error('The saleId cannot be undefined');
    }
    const params = new HttpParams().set('saleId', saleId);
    const headers = this.getAuthHeaders();
    return this.http.put<Cart>(`${this.apiUrl}/fail`, null, { headers, params });
  }

  getSaleById(saleId: number): Observable<Sale> {
    const headers = this.getAuthHeaders();
    return this.http.get<Sale>(`${this.apiUrl}/${saleId}`, { headers });
  }

  getSaleByProfileId(): Observable<Sale[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Sale[]>(`${this.apiUrl}`, { headers });
  }
}
