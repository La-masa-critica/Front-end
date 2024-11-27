import {
  Component,
  OnInit,
  OnDestroy,
  signal,
  computed,
  WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { Sale } from '@models/sale.model';
import { SaleService } from '@services/sale.service';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { environment } from '@env/environment';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-checkout',
  templateUrl: '../html/checkout.component.html',
  standalone: true,
  imports: [DatePipe, CurrencyPipe],
  hostDirectives: [],
})
export class CheckoutComponent implements OnInit, OnDestroy {
  profileid: number = 1;
  checkoutData: WritableSignal<Sale | null> = signal(null);

  // Add computed properties
  total = computed(() => this.checkoutData()?.total ?? 0);
  saleDate = computed(() => this.checkoutData()?.date ?? '');

  constructor(
    private readonly router: Router,
    private readonly saleService: SaleService
  ) {}

  ngOnInit(): void {
    console.log('CheckoutComponent initialized');
    this.loadcheckout();
  }

  ngOnDestroy(): void {
    // Call failSale if sale wasn't confirmed or canceled
    const saleId = this.checkoutData()?.id;
    const status = this.checkoutData()?.status;

    if (saleId && status !== 'CONFIRMED' && status !== 'CANCELLED') {
      this.saleService.failSale(saleId).subscribe({
        next: (cart) => {
          console.log('Sale failed due to navigation away from checkout');
        },
        error: (error) => {
          console.error('Error failing sale:', error);
        }
      });
    }
  }

  confirmPurchase(): void {
    const saleId = this.checkoutData()?.id;
    if (!saleId) return;

    this.saleService
      .confirmSale(saleId)
      .pipe(
        catchError((error) => {
          console.error('Error confirming purchase:', error);
          return of(null);
        })
      )
      .subscribe((sale: Sale | null) => {
        if (!sale) {
          console.error('Error: Sale is null');
          return;
        }
        this.checkoutData.set(sale);
        console.log('Purchase confirmed:', sale);
        alert('Compra confirmada');
        this.router.navigate(['/']);
      });
  }

  cancelPurchase(): void {
    this.saleService
      .cancelSale(this.checkoutData()?.id)
      .pipe(
        catchError((error) => {
          console.error('Error canceling purchase:', error);
          return of(null);
        })
      )
      .subscribe((sale: Sale | null) => {
        if (sale) {
          this.checkoutData.set(sale);
          alert('Compra cancelada');
          this.router.navigate(['/']);
        }
      });
  }

  loadcheckout(): void {
    console.log('loadcheckout called');
    const sale = environment.currentSale;
    if (!sale) {
      alert('No hay compra en proceso');
      this.router.navigate(['/']);
      return;
    }

    this.checkoutData.set(sale);
    console.log('Checkout data:', this.checkoutData());
  }
}
