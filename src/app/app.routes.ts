import { Routes } from '@angular/router';
import { MainComponent } from '@components/ts/main.component';
import { CheckoutComponent } from '@components/ts/checkout.component';
import { SalesHistoryComponent } from '@components/ts/sales-history.component';

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
