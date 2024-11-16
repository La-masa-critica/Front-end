import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { CheckoutComponent } from './checkout.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'checkout', component: CheckoutComponent },
];
