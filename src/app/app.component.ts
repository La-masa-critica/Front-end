import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CartStateService } from './cart-state.service';
import { NgClass } from '@angular/common';
import { filter } from 'rxjs';

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
