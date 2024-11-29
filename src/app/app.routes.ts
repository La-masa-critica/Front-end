import { Routes } from '@angular/router';
import { MainComponent } from '@app/components/main/main.component';
import { CheckoutComponent } from '@app/components/checkout/checkout.component';
import { SalesHistoryComponent } from '@app/components/sales-hisoty/sales-history.component';
import { LoginComponent } from '@app/components/login/login.component';
import { AuthGuard } from './services/auth.guard';
import { RegisterComponent } from './components/signup/signup.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
  },
  {
    path: 'register',
    component: RegisterComponent,
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
