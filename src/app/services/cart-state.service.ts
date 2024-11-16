import { Injectable, signal, computed } from '@angular/core';
import { Cart } from '../models/cart.model';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartStateService {
  cartData = signal<Cart | null>(null);
  isCartOpen = signal(false);

  cartItemCount = computed(() => this.cartData()?.items?.length ?? 0);

  constructor(private router: Router) {
    // Close cart on route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        if (this.router.url !== '/') {
          this.isCartOpen.set(false);
        }
      });
  }

  toggleCart(): void {
    this.isCartOpen.update((v) => !v);
  }
}
