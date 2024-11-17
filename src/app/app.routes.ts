import { Routes } from '@angular/router';
import { MainComponent } from './components/main.component';
import { CheckoutComponent } from './components/checkout.component';
import { SalesHistoryComponent } from './components/sales-history.component';

export const routes: Routes = [
  {
    path: '',
    component: MainComponent,
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
  },
  {
    path: 'sales-history',
    component: SalesHistoryComponent,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
