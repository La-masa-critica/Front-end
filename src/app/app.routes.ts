import { Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { CheckoutComponent } from './checkout.component';
import { SalesHistoryComponent } from './sales-history.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent
  },
  {
    path: 'checkout',
    component: CheckoutComponent
  },
  {
    path: 'sales-history',
    component: SalesHistoryComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];
