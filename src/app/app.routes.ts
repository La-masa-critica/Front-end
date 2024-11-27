import { Routes } from '@angular/router';
import { MainComponent } from '@components/ts/main.component';
import { CheckoutComponent } from '@components/ts/checkout.component';
import { SalesHistoryComponent } from '@components/ts/sales-history.component';
import { loginComponent } from '@components/ts/loginComponent';
import { AuthGuard } from './services/authGuard';
import { registerComponent } from './components/ts/register.component';

export const routes: Routes = [
  {
    path: 'login',
    component: loginComponent,
  },
  {
    path: 'register',
    component: registerComponent,
  },
  {
    path: '',
    component: MainComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'checkout',
    component: CheckoutComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'sales-history',
    component: SalesHistoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    canActivate: [AuthGuard]
  },
];
