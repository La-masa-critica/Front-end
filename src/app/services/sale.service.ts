import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { Sale } from '@models/sale.model';
import { environment } from '@env/environment';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  private readonly apiUrl = environment.saleApiUrl;
  private readonly updateQuantitySubject = new Subject<{
    profileId: number;
    itemId: number;
    quantity: number;
  }>();
  constructor(private readonly http: HttpClient) {}

  checkout(cartId: number): Observable<Sale> {
    const params = new HttpParams().set('cartId', cartId);
    return this.http.post<Sale>(`${this.apiUrl}/checkout`, {}, { params });
  }

  confirmSale(saleId: number | undefined): Observable<Sale> {
    if (saleId == undefined) {
      throw new Error('The saleId cannot be undefined');
    }
    const params = new HttpParams().set('saleId', saleId);
    const headers = new HttpHeaders({
      Accept: 'application/json',
    });

    return this.http.put<Sale>(`${this.apiUrl}/confirm`, null, {
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
      Accept: 'application/json',
    });

    return this.http.put<Sale>(`${this.apiUrl}/cancel`, null, {
      headers,
      params,
    });
  }

  getSaleById(saleId: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/${saleId}`);
  }

  getSaleByProfileId(profileId: number): Observable<Sale[]> {
    const params = new HttpParams().set('profileId', profileId);
    return this.http.get<Sale[]>(`${this.apiUrl}`, { params });
  }
}
