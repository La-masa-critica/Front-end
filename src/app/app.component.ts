import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CartStateService } from '@services/cart-state.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  imports: [RouterModule, NgClass],
})
export class AppComponent {
  constructor(
    public readonly router: Router,
    public readonly cartState: CartStateService
  ) {}
}
