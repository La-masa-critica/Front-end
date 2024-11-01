import { Component, OnInit } from '@angular/core';
import { ItemService } from './item.service';
import { CategoryService } from './category.service';
import { Item } from './item.model';
import { Category } from './category.model';
import { catchError, of } from 'rxjs';
import { CartService } from './sale.service';
import { Cart } from './cart.model';
import { Sale } from './sale.model';
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
  cart: { item: Item; quantity: number }[] = [];
  
  cart2: Cart = { cartId: 0, items: [] };
  total: number = 0;

  constructor(private itemService: ItemService, private categoryService: CategoryService,private cartService: CartService) {}

  ngOnInit(): void {
    this.loadItems();
    this.loadCategories();
  }

  loadItems(): void {
    this.itemService.getItems().pipe(
      catchError(error => {
        console.error('Error loading items:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.allItems = data; // Carga todos los productos en `allItems`
      this.items = data; // Muestra todos los productos inicialmente
    });
  }

  loadCategories(): void {
    this.categoryService.getCategories().pipe(
      catchError(error => {
        console.error('Error loading categories:', error);
        return of([]);
      })
    ).subscribe(data => {
      this.categories = data;
    });
  }

  filterItemsByCategory(): void {
    // Convertir selectedCategoryId a número
    const categoryId = this.selectedCategoryId ? Number(this.selectedCategoryId) : null;
    
    if (categoryId !== null && categoryId !== 0) {
      this.items = this.allItems.filter(item =>
        item.categoryList.some(category => category.id === categoryId)
      );
    } else {
      this.items = this.allItems; // Muestra todos los productos si la categoría es "Todas las categorías" (id 0)
    }
  }

  addToCart(item: Item): void {
    const existingItem = this.cart.find(cartItem => cartItem.item.id === item.id);
  
    if (existingItem) {
      if (existingItem.quantity < item.stock) {
        existingItem.quantity++; // Incrementa la cantidad si no se ha alcanzado el stock
      } else {
        //alert('No puedes añadir más de este producto.'); // O muestra un mensaje al usuario
      }
    } else {
      if (item.stock > 0) {
        this.cart.push({ item, quantity: 1 }); // Agrega el producto al carrito si hay stock disponible
      } else {
        alert('Este producto no está disponible.'); // O muestra un mensaje al usuario
      }
    }
  }

  deleteToCart(item: Item): void {
    const existingItem = this.cart.find(cartItem => cartItem.item.id === item.id);
  
    if (existingItem) {
      if (existingItem.quantity > 1) {
        existingItem.quantity--; // Disminuye la cantidad si es mayor que 1
      } else {
        this.cart = this.cart.filter(cartItem => cartItem.item.id !== item.id); // Elimina el producto del carrito si la cantidad es 1
      }
    }
  }
  
  
  calculateTotal(): string {
    const total = this.cart.reduce((total, cartItem) => total + (cartItem.item.price * cartItem.quantity), 0);
    return total.toFixed(2); // Devuelve el total con 2 decimales
  }
  
  removeFromCart(item: Item): void {
    this.cart = this.cart.filter(cartItem => cartItem.item.id !== item.id); // Filtra para eliminar el artículo del carrito
  }

  updateCartItem(cartItem: any): void {
    if (cartItem.quantity > cartItem.item.stock) {
      alert('No puedes añadir más de este producto que hay en stock.');
      cartItem.quantity = cartItem.item.stock; // Restablece a la cantidad máxima en stock
    }
  }

  totalAmount(): number {
    return this.cart.reduce((total, cartItem) => {
      return total + (cartItem.item.price * cartItem.quantity);
    }, 0);
  }


  confirmCart(): void {
    // Calcular total y preparar el objeto de venta
    const sale: Sale = {
      id: 0,
      profileId: 0, // Ajusta según tu lógica
      date: new Date().toISOString(),
      status: 'Pending',
      total: this.totalAmount(), // Usa la función para calcular el total
      comments: '',
      saleDetails: this.cart.map(cartItem => ({
        id: 0,
        itemId: cartItem.item.id, // Asegúrate de acceder al ID correcto del item
        quantity: cartItem.quantity,
        price: cartItem.item.price, // Accede al precio del item
      })),
    };
  
    // Primero, agrega el carrito
    this.cartService.addCart(this.cart2).subscribe(() => {
      // Luego, confirma la venta
      this.cartService.confirmSale(sale).subscribe(() => {
        console.log('Carrito confirmado y venta registrada');
        // Aquí puedes limpiar el carrito o mostrar un mensaje de éxito
      });
    });
  }
  
}
