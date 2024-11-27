import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SaleService } from '@services/sale.service';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
  ],
  providers: [
    SaleService
  ],
})
export class AppModule {}
