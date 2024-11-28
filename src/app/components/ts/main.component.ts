import {
  Component,
  OnInit,
  signal,
  computed,
  WritableSignal,
} from '@angular/core';
import { ItemService } from '@services/item.service';
import { CategoryService } from '@services/category.service';
import { Item } from '@models/item.model';
import { Category } from '@models/category.model';
import { catchError, of } from 'rxjs';
import { SaleService } from '@services/sale.service';
import { CartService } from '@services/cart.service';
import { Sale } from '@models/sale.model';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { DecimalPipe, NgOptimizedImage } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CartStateService } from '@services/cart-state.service';

@Component({
  selector: 'app-main',
  templateUrl: '../html/main.component.html',
  standalone: true,
  imports: [FormsModule, DecimalPipe, NgOptimizedImage],
  providers: [ItemService, CategoryService, SaleService, CartService],
})
export class MainComponent implements OnInit {
  items: WritableSignal<Item[]> = signal([]);
  categories: WritableSignal<Category[]> = signal([]);
  selectedCategories: WritableSignal<Category[]> = signal([]);
  isLoading = signal(false);

  total = computed(() => {
    return (
      this.cartState.cartData()?.items.reduce((acc, item) => {
        return acc + (item.price ?? 0) * item.quantity;
      }, 0) ?? 0
    );
  });

  hasDisabledItems = computed(() => {
    return (
      this.cartState
        .cartData()
        ?.items.some(
          (item) =>
            this.allItems.find((i) => i.id === item.itemId)?.enabled === false
        ) ?? false
    );
  });

  minPrice: string = '';
  maxPrice: string = '';
  readonly profileid: number = 1;
  allItems: Item[] = [];
  currentSale: Sale | null = null;

  constructor(
    private readonly itemService: ItemService,
    private readonly categoryService: CategoryService,
    private readonly saleService: SaleService,
    private readonly cartService: CartService,
    public readonly router: Router,
    public readonly cartState: CartStateService
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();
    setTimeout(() => {
    this.loadCart();
    }, 300); 
  }

  //Carga productos
  loadItems(): void {
    this.itemService
      .getItems()
      .pipe(
        catchError((error) => {
          console.error('Error loading items:', error);
          return of([]);
        })
      )
      .subscribe((data) => {
        const sortedData = data.sort((a, b) => a.id - b.id);
        this.allItems = sortedData;
        this.items.set(sortedData.filter((item) => item.enabled));
        this.cartLoadNamesAndPrice();
      });
  }

  //Carga categorias
  loadCategories(): void {
    this.categoryService
      .getCategories()
      .pipe(
        catchError((error) => {
          console.error('Error loading categories:', error);
          return of([]);
        })
      )
      .subscribe((data) => {
        this.categories.set(data);
      });
  }

  // Define los nuevos productos a mostrar según categorías
  filterItemsByCategory(): void {
    const selectedCategoryIds = this.selectedCategories().map(
      (category) => category.id
    );
    if (selectedCategoryIds.length === 0) {
      this.items.set(this.allItems);
      return;
    }
    this.items.set(
      this.allItems.filter((item) =>
        item.categoryList.some((category) =>
          selectedCategoryIds.includes(category.id)
        )
      )
    );
    this.cartLoadNamesAndPrice();
  }

  addCategory(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = Number(selectElement.value);
    const selectedCategory = this.categories().find(
      (category) => category.id === categoryId
    );
    if (
      selectedCategory &&
      !this.selectedCategories().includes(selectedCategory)
    ) {
      this.selectedCategories.update((cats) => [...cats, selectedCategory]);
      this.categories.update((cats) =>
        cats.filter((category) => category.id !== categoryId)
      );
    }
  }

  removeCategory(id: number): void {
    this.selectedCategories.update((cats) =>
      cats.filter((category) => category.id !== id)
    );
    const removedCategory = this.allItems
      .flatMap((item) => item.categoryList)
      .find((category) => category.id === id);
    if (removedCategory) {
      this.categories.update((cats) => [...cats, removedCategory]);
    }
    this.filterItemsByCategory(); // Add this line to update filtered items
  }

  //Filtrar por precios con/sin categorias
  filterItems(): void {
    const categoryIds =
      this.selectedCategories().length > 0
        ? this.selectedCategories().map((category) => category.id)
        : undefined;

    const minPrice = this.minPrice ? parseFloat(this.minPrice) : undefined;
    const maxPrice = this.maxPrice ? parseFloat(this.maxPrice) : undefined;
    this.itemService
      .filterItems(categoryIds, minPrice, maxPrice)
      .pipe(
        catchError((error) => {
          console.error('Error filtering items:', error);
          return of([]);
        })
      )
      .subscribe((filteredItems) => {
        if (filteredItems.length === 0) {
          console.log('No se encontraron productos con los filtros aplicados.');
        }
        this.items.set(filteredItems);
      });
    this.cartLoadNamesAndPrice();
  }

  //LOGICA DEL CARRITO A PARTIR DE AQUI
  loadCart(): void {
    this.cartService
      .getCartByProfileId(this.profileid)
      .pipe(
        catchError((error) => {
          console.error('Error loading cart:', error);
          return of(null);
        })
      )
      .subscribe((cartDataFound) => {
        if (!cartDataFound) {
          this.cartState.cartData.set(null);
          return;
        }

        if (cartDataFound.items) {
          cartDataFound.items.sort((a, b) => a.itemId - b.itemId);
        }

        this.cartState.isCartOpen.set(cartDataFound.items.length > 0);
        this.cartState.cartData.set(cartDataFound);
        this.cartLoadNamesAndPrice(); // Ensure names are loaded after cart is loaded
      });
  }

  private cartLoadNamesAndPrice(): void {
    this.cartState.cartData.update((currentCart) => {
      if (!currentCart?.items) return currentCart;

      const updatedItems = currentCart.items
        .map((item) => {
          const foundItem = this.items().find((i) => i.id === item.itemId);
          if (!foundItem) return item;

          return {
            ...item,
            name: foundItem.name,
            price: foundItem.price ?? 0,
          };
        })
        .sort((a, b) => a.itemId - b.itemId); // Sort items after mapping

      return {
        ...currentCart,
        items: updatedItems,
      };
    });
  }

  //Agregar elemento al carrito
  addToCart(itemId: number): void {
    if (this.isLoading()) return;

    const item = this.items().find((i) => i.id === itemId);
    if (!item) {
      console.error('Item not found');
      return;
    }
    if (!item.stock || item.stock <= 0) {
      alert('Este producto está agotado');
      return;
    }
    this.isLoading.set(true);

    const cartItem = this.cartState
      .cartData()
      ?.items.find((i) => i.itemId === itemId);
    if (cartItem) {
      this.increaseQuantity(cartItem);
      this.isLoading.set(false);
      return;
    }


    this.cartService
      .addCart(this.profileid, itemId, 1)
      .pipe(
        catchError((error) => {
          console.error('Error adding to cart:', error);
          alert('Error al agregar al carrito');
          return of(null);
        })
      )
      .subscribe({
        next: (cart) => this.handleAddToCartSuccess(cart),
        complete: () => this.isLoading.set(false),
      });
  }

  private handleAddToCartSuccess(cart: any): void {
    if (!cart) return;
    this.cartState.cartData.set(cart);
    this.cartLoadNamesAndPrice();
    this.cartState.isCartOpen.set(true);
  }

  eliminateToCart(itemId: number): void {
    this.cartService.removeFromCart(this.profileid, itemId).subscribe(() => {
      this.loadCart();
    });
  }

  increaseQuantity(item: { itemId: number; quantity: number }): void {
    const product = this.items().find((i) => i.id === item.itemId);
    if (!product || item.quantity >= product.stock) {
      alert('No hay más stock disponible');
      return;
    }
    item.quantity += 1;
    this.cartService.queueUpdateCartQuantity(
      this.profileid,
      item.itemId,
      item.quantity
    );
    this.cartLoadNamesAndPrice();
  }

  decreaseQuantity(item: { itemId: number; quantity: number }): void {
    if (item.quantity > 1) {
      item.quantity -= 1;
      this.cartService.queueUpdateCartQuantity(
        this.profileid,
        item.itemId,
        item.quantity
      );
      this.cartLoadNamesAndPrice();
    }else{
      this.eliminateToCart(item.itemId)
    }
  }

  updateQuantity(item: { itemId: number; quantity: number }): void {
    const product = this.items().find((i) => i.id === item.itemId);
    if (!product) {
      alert('Producto no encontrado');
      return;
    }
    if (item.quantity > product.stock) {
      alert('No hay más stock disponible');
      item.quantity = product.stock;
    }
    if(item.quantity === 0) {
      this.eliminateToCart(item.itemId)
    }else{
      this.cartService.queueUpdateCartQuantity(
        this.profileid,
        item.itemId,
        item.quantity
      );
    }
    this.cartLoadNamesAndPrice();
  }

  goToCheckout(): void {
    const cart = this.cartState.cartData();
    if (!cart?.items.length) {
      alert('No hay artículos en el carrito para proceder al checkout.');
      return;
    }
    if (cart.items.some((item) => item.quantity <= 0)) {
      alert('No se pueden comprar productos con cantidad 0.');
      return;
    }
    if (!cart.id) {
      console.error('No cart data found');
      return;
    }

    this.saleService.checkout(cart.id).subscribe({
      next: (sale) => {
        this.currentSale = sale;
        environment.currentSale = sale;
        console.log('Navigating to /checkout');
        this.router.navigate(['/checkout']);
      },
      error: (error) => {
        console.error('Error during checkout:', error);
        alert('Error during checkout. Please try again.');
      },
    });
  }

  toggleCart(): void {
    this.cartState.isCartOpen.update((v) => !v);
  }

  openCart(): void {
    this.cartState.isCartOpen.set(true);
  }

  // Get category name by ID
  getCategoryNameById(id: number): string {
    return this.categories().find((category) => category.id === id)?.name ?? '';
  }

  emptyCart(): void {
    this.cartService.emptyCart(this.profileid).subscribe(() => this.loadCart());
  }

  isItemEnabled(itemId: number): boolean {
    return this.allItems.find((i) => i.id === itemId)?.enabled ?? false;
  }
}
