import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Checkout } from './checkout.model';
import { CartService } from './sale.service';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
    profileid: number = 3;
    checkoutData: Checkout | null = null;
  constructor(private router: Router, private cartService: CartService) {}

  ngOnInit(): void {
    this.loadcheckout();
  }

  confirmPurchase(): void {

    this.cartService.confirmSale(this.profileid).subscribe(  () => {}  );
    // Aquí puedes añadir la lógica para enviar la información del pedido al backend
    alert('Compra confirmada');
    this.router.navigate(['/']); // Redirige al usuario a la página principal o donde desees
  }


  cancelPurchase(): void {
    this.cartService.cancelSale(this.profileid).subscribe(  () => {}  );
    alert('Compra cancelada');
    this.router.navigate(['/']); // Redirige al usuario de nuevo al carrito
  }

  loadcheckout(): void{
    this.cartService.checkout(this.profileid).subscribe(
        (checkout: Checkout) => {
          this.checkoutData = checkout; // Asigna el objeto Checkout a checkoutdata
        }
      );
  }
}