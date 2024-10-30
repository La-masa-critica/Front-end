import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { TarjetaArticuloComponent } from 'src/app/core/components/tarjeta-articulo/tarjeta-producto.component';
import { Producto } from 'src/app/core/interfaces/productos';
import { ProductosService } from 'src/app/core/services/productos.service';
import { HeaderService } from 'src/app/core/services/header.service';
import { CartService } from 'src/app/core/services/cart.service'; 
import { CarritoComponent } from 'src/app/pages/carrito/carrito.component'; // Asegúrate de la ruta
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [TarjetaArticuloComponent, CarritoComponent, CommonModule, RouterModule]
})
export class HomeComponent implements OnInit, OnDestroy {
  headerService = inject(HeaderService);
  productosService = inject(ProductosService);
  cartService = inject(CartService); 
  router = inject(Router); 

  productos: Producto[] = [];

  ngOnInit(): void {
    this.headerService.titulo.set("La masa crítica");
    this.headerService.extendido.set(true);
    this.productosService.getAll().then(res => this.productos = res);
  }

  ngOnDestroy(): void {
    this.headerService.extendido.set(false);
  }

  agregarAlCarrito(producto: Producto) {
    if (!producto) return;
    const cantidad = 1; 
    const notas = ""; 

    this.cartService.agregarProducto(producto.id, cantidad, notas);
    //this.router.navigate(["/carrito"]);
  }
}