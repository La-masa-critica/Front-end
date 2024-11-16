import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Sale } from './sale.model';
import { SaleService } from './sale.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '../envitoment';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
})
export class CheckoutComponent implements OnInit {
  profileid: number = 1;
  checkoutData: Sale | null = null;

  constructor(
    private readonly router: Router,
    private readonly saleService: SaleService
  ) {}

  ngOnInit(): void {
    console.log('CheckoutComponent initialized');
    this.loadcheckout();
  }

  confirmPurchase(): void {
    this.saleService
      .confirmSale(this.checkoutData?.id)
      .pipe(
        catchError((error) => {
          console.error('Error confirming purchase:', error);
          return of(null);
        })
      )
      .subscribe((sale: Sale | null) => {
        if (sale) {
          this.checkoutData = sale;
          console.log('Purchase confirmed:', sale);
          alert('Compra confirmada');
          this.router.navigate(['/']);
        } else {
          console.error('Error: Sale is null');
        }
      });
  }

  cancelPurchase(): void {
    this.saleService
      .cancelSale(this.checkoutData?.id)
      .pipe(
        catchError((error) => {
          console.error('Error canceling purchase:', error);
          return of(null);
        })
      )
      .subscribe((sale: Sale | null) => {
        if (sale) {
          this.checkoutData = sale;
          alert('Compra cancelada');
          this.router.navigate(['/']);
        }
      });
  }

  loadcheckout(): void {
    console.log('loadcheckout called');
    this.checkoutData = environment.currentSale; // Read the sale from environment.currentSale
    if (!this.checkoutData) {
      alert('No hay compra en proceso');
      this.router.navigate(['/']);
    } else {
      console.log('Checkout data:', this.checkoutData);
    }
  }
}
