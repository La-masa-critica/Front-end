import { Component, OnInit, signal } from '@angular/core';
import { SaleService } from '../services/sale.service';
import { Sale } from '../models/sale.model';
import { DatePipe, CurrencyPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-sales-history',
  templateUrl: './sales-history.component.html',
  standalone: true,
  imports: [DatePipe, CurrencyPipe, NgClass],
})
export class SalesHistoryComponent implements OnInit {
  sales = signal<Sale[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  readonly profileId = 1;

  constructor(private readonly saleService: SaleService) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.saleService.getSaleByProfileId(this.profileId).subscribe({
      next: (sales) => {
        this.sales.set(
          sales.sort((a, b) => {
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          })
        );
        this.isLoading.set(false);
      },
      error: (error) => {
        console.error('Error loading sales:', error);
        this.error.set('Error al cargar el historial de compras');
        this.isLoading.set(false);
      },
    });
  }

  getStateClass(state: string): string {
    switch (state) {
      case 'COMPLETED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}
