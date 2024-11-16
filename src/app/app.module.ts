import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
// import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SaleService } from './services/sale.service';

@NgModule({
  imports: [
    BrowserModule,
    // AppRoutingModule,
    FormsModule,
    RouterModule,
  ],
  providers: [SaleService, provideHttpClient()],
  // bootstrap: [AppComponent]
})
export class AppModule {}
