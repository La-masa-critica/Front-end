import { Component, OnInit } from '@angular/core';
import { ItemService } from './item.service';
import { CategoryService } from './category.service';
import { Item } from './item.model';
import { Category } from './category.model';
import { catchError, of } from 'rxjs';
import { CartService } from './sale.service';
import { Cart } from './cart.model';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  items: Item[] = [];
  allItems: Item[] = []; // Lista completa de productos para aplicar el filtro
  categories: Category[] = [];
  selectedCategoryId: number | null = null; // Cambiado a null
  itemIdToShow: Item | null = null;
  minPrice: string = '';
  maxPrice: string = '';
  total: number = 0;
  cartData: Cart | null = null;
  profileid: number = 1;
  cartItems: number[] = [];


  constructor(private itemService: ItemService, private categoryService: CategoryService, private cartService: CartService, public router: Router) { }

  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();

    this.loadNames();
    this.loadCart();
  }
  //Carga productos
  loadItems(): void {
    this.itemService.getItems().pipe(
      catchError(error => {
        console.error('Error loading items:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.allItems = data;
      this.items = data;
      this.items.sort((item1, item2) => item1.id - item2.id);
    });
    this.loadNames();

  }
  //Carga categorias
  loadCategories(): void {
    this.categoryService.getCategories().pipe(
      catchError(error => {
        console.error('Error loading categories:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.categories = data;
    });
    this.loadNames();
  }
  //Define los nuevos productos a mostrar segun categoria
  filterItemsByCategory(): void {
    const categoryId = this.selectedCategoryId ? Number(this.selectedCategoryId) : null;

    if (categoryId !== null && categoryId !== 0) {
      this.items = this.allItems.filter(item =>
        item.categoryList.some(category => category.id === categoryId)
      );
    } else {
      this.items = this.allItems;
    }
    this.loadNames();
  }

  //Filtrar por precios con/sin categoria
  filterItems(): void {

    let categoryIds: number[] | undefined;


    if (this.selectedCategoryId && this.selectedCategoryId != 0) {
      categoryIds = [this.selectedCategoryId];
    } else {
      categoryIds = undefined;
    }


    const minPrice = this.minPrice ? parseFloat(this.minPrice) : undefined;
    const maxPrice = this.maxPrice ? parseFloat(this.maxPrice) : undefined;
    console.log(minPrice);
    console.log(maxPrice);
    console.log(categoryIds);
    console.log(this.categories.map(category => category.id));


    this.itemService.filterItems(categoryIds, minPrice, maxPrice).subscribe(filteredItems => {
      if (filteredItems.length === 0) {
        console.log('No se encontraron productos con los filtros aplicados.');
      }
      this.items = filteredItems;
    });
    this.loadNames();
  }
  //LOGICA DEL CARRITO A PARTIR DE AQUI
  loadCart(): void {
    this.cartService.getCartByProfileId(this.profileid).subscribe(cartDatafound => {
      this.cartData = cartDatafound;
      this.loadNames();
    });
    console.log(this.cartData);
    // this.loadCartwithNames();
  }



  loadNames(): void {
    this.cartData?.items.forEach(item => {
      if (item.name === undefined) {
        item.name = this.items.find(element => element.id === item.itemId)?.name
      }
    })
    this.cartData?.items.sort((item1, item2) => item1.itemId - item2.itemId);
  }
  //Agregar elemento al carrito
  addToCart(itemId: number): void {

    this.cartService.addCart(this.profileid, itemId, 1).subscribe(
      cart => {
        console.log(cart);
        this.cartData = cart;
        this.loadNames();
      }
    );

  }

  eliminateToCart(itemId: number): void {

    this.cartService.removeFromCart(this.profileid, itemId).subscribe(() => { });
    this.actualizar();
    this.loadNames();
  }



  isInCart(itemId: number): boolean {
    return this.cartItems.includes(itemId);
  }

  async updateCartAndLoad(item: { itemId: number; quantity: number }) {

    this.cartService.updateCartQuantity(this.profileid, item.itemId, item.quantity);
    await this.actualizar();

    // setTimeout(() => {
    //   this.loadCart();
    //   this.loadNames();
    // }, 100); // 500 ms de retraso
  }

  async actualizar() {
    setTimeout(() => {
      this.loadCart();
      this.loadNames();
    }, 100); // 500 ms de retraso
  }



  increaseQuantity(item: { itemId: number; quantity: number }): void {
    item.quantity += 1;
    this.cartService.updateCartQuantity(this.profileid, item.itemId, item.quantity).subscribe(() => { });
    this.updateCartAndLoad(item);
    this.loadNames();
  }

  decreaseQuantity(item: { itemId: number; quantity: number }): void {
    if (item.quantity < 1) { return }
    item.quantity -= 1;
    this.cartService.updateCartQuantity(this.profileid, item.itemId, item.quantity).subscribe(() => { });
    this.updateCartAndLoad(item);
    this.loadNames();
  }

  updateQuantity(item: { itemId: number; quantity: number }): void {
    this.cartService.updateCartQuantity(this.profileid, item.itemId, item.quantity).subscribe(() => { });
    this.updateCartAndLoad(item);
    this.loadNames();
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }


}
