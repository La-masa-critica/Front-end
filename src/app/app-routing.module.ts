import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { CheckoutComponent } from './checkout.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'checkout', component: CheckoutComponent },
  // ...other routes...
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
