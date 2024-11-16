import { Component, OnInit } from '@angular/core';
import { ItemService } from './item.service';
import { CategoryService } from './category.service';
import { Item } from './item.model';
import { Category } from './category.model';
import { catchError, of } from 'rxjs';
import { SaleService } from './sale.service';
import { Cart } from './cart.model';
import { Sale } from './sale.model';
import { Router } from '@angular/router';
import { environment } from '../envitoment';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
})
export class MainComponent implements OnInit {
  readonly title = 'my-project';
  items: Item[] = [];
  allItems: Item[] = []; // Lista completa de productos para aplicar el filtro
  categories: Category[] = [];
  selectedCategories: Category[] = []; // Changed to an array of categories
  itemIdToShow: Item | null = null;
  minPrice: string = '';
  maxPrice: string = '';
  total: number = 0;
  cartData: Cart | null = null;
  readonly profileid: number = 1;
  cartItems: number[] = [];
  isCartOpen: boolean = false;
  currentSale: Sale | null = null;

  constructor(
    private readonly itemService: ItemService,
    private readonly categoryService: CategoryService,
    private readonly saleService: SaleService,
    public readonly router: Router
  ) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();
    this.loadCart();
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
        this.allItems = data;
        this.items = data;
        this.items.sort((item1, item2) => item1.id - item2.id);
        this.cartLoadNamesAndPrice(); // Ensure names are loaded after items are loaded
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
        this.categories = data;
      });
  }

  // Define los nuevos productos a mostrar según categorías
  filterItemsByCategory(): void {
    const selectedCategoryIds = this.selectedCategories.map(
      (category) => category.id
    );
    if (selectedCategoryIds.length > 0) {
      this.items = this.allItems.filter((item) =>
        item.categoryList.some((category) =>
          selectedCategoryIds.includes(category.id)
        )
      );
    } else {
      this.items = this.allItems;
    }
    this.cartLoadNamesAndPrice();
  }

  addCategory(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    const categoryId = Number(selectElement.value);
    const selectedCategory = this.categories.find(
      (category) => category.id === categoryId
    );
    if (
      selectedCategory &&
      !this.selectedCategories.includes(selectedCategory)
    ) {
      this.selectedCategories.push(selectedCategory);
      this.categories = this.categories.filter(
        (category) => category.id !== categoryId
      );
    }
  }

  removeCategory(id: number): void {
    this.selectedCategories = this.selectedCategories.filter(
      (category) => category.id !== id
    );
    const removedCategory = this.allItems
      .flatMap((item) => item.categoryList)
      .find((category) => category.id === id);
    if (removedCategory) {
      this.categories.push(removedCategory);
    }
    // Do not call filterItemsByCategory here to avoid updating the items
  }

  //Filtrar por precios con/sin categorias
  filterItems(): void {
    const categoryIds =
      this.selectedCategories.length > 0
        ? this.selectedCategories.map((category) => category.id)
        : undefined;

    const minPrice = this.minPrice ? parseFloat(this.minPrice) : undefined;
    const maxPrice = this.maxPrice ? parseFloat(this.maxPrice) : undefined;
    console.log(minPrice);
    console.log(maxPrice);
    console.log(categoryIds);
    console.log(this.categories.map((category) => category.id));

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
        this.items = filteredItems;
      });
    this.cartLoadNamesAndPrice();
  }

  //LOGICA DEL CARRITO A PARTIR DE AQUI
  loadCart(): void {
    this.saleService
      .getCartByProfileId(this.profileid)
      .pipe(
        catchError((error) => {
          console.error('Error loading cart:', error);
          return of(null);
        })
      )
      .subscribe((cartDatafound) => {
        if (cartDatafound) {
          this.cartData = cartDatafound;
          this.cartLoadNamesAndPrice(); // Ensure names are loaded after cart is loaded
          if (this.cartData.items.length > 0) {
            this.isCartOpen = true; // Open the cart if there are items
          }
        }
      });
  }

  cartLoadNamesAndPrice(): void {
    this.cartData?.items.forEach((item) => {
      if (!item.name) {
        item.name = this.items.find(
          (element) => element.id === item.itemId
        )?.name;
        item.price = this.items.find(
          (element) => element.id === item.itemId
        )?.price;
      }
    });
    this.cartData?.items.sort((item1, item2) => item1.itemId - item2.itemId);
  }

  //Agregar elemento al carrito
  addToCart(itemId: number): void {
    const item = this.items.find((i) => i.id === itemId);
    if (item) {
      this.saleService.addCart(this.profileid, itemId, 1).subscribe((cart) => {
        this.cartData = cart;
        this.cartLoadNamesAndPrice(); // Ensure names are loaded after adding an item
        this.isCartOpen = true; // Open the cart after adding an item
      });
    }
  }

  eliminateToCart(itemId: number): void {
    this.saleService.removeFromCart(this.profileid, itemId).subscribe(() => {
      this.loadCart();
    });
  }

  increaseQuantity(item: { itemId: number; quantity: number }): void {
    item.quantity += 1;
    this.saleService.queueUpdateCartQuantity(this.profileid, item.itemId, item.quantity);
    this.cartLoadNamesAndPrice();
  }

  decreaseQuantity(item: { itemId: number; quantity: number }): void {
    if (item.quantity > 0) {
      item.quantity -= 1;
      this.saleService.queueUpdateCartQuantity(this.profileid, item.itemId, item.quantity);
      this.cartLoadNamesAndPrice();
    }
  }

  updateQuantity(item: { itemId: number; quantity: number }): void {
    this.saleService.queueUpdateCartQuantity(this.profileid, item.itemId, item.quantity);
    this.cartLoadNamesAndPrice();
  }

  goToCheckout(): void {
    if (this.cartData?.items.length) {
      this.saleService.checkout(this.cartData.id).subscribe({
        next: (sale) => {
          this.currentSale = sale;
          environment.currentSale = sale; // Assign the sale to environment.currentSale
          console.log('Navigating to /checkout');
          this.router.navigate(['/checkout']);
        },
        error: (error) => {
          console.error('Error during checkout:', error);
          alert('Error during checkout. Please try again.');
        },
      });
    } else {
      alert('No hay artículos en el carrito para proceder al checkout.');
    }
  }

  toggleCart(): void {
    this.isCartOpen = !this.isCartOpen;
  }

  openCart(): void {
    this.isCartOpen = true;
  }

  // Get category name by ID
  getCategoryNameById(id: number): string {
    return this.categories.find((category) => category.id === id)?.name ?? '';
  }

  emptyCart(): void {
    if (this.cartData) {
      this.cartData.items.forEach((item) => {
        this.saleService
          .removeFromCart(this.profileid, item.itemId)
          .subscribe(() => {
            this.loadCart();
          });
      });
    }
  }
}
