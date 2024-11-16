import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule } from '@angular/forms';
import { MainComponent } from './main.component';
import { CheckoutComponent } from './checkout.component';
import { SaleService } from './sale.service';

@NgModule({
  declarations: [AppComponent, MainComponent, CheckoutComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [SaleService],
  bootstrap: [AppComponent],
})
export class AppModule {}
