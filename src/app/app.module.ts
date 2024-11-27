import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SaleService } from '@services/sale.service';
import { loginComponent } from '@components/ts/loginComponent';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
  ],
  providers: [SaleService, provideHttpClient()],
})
export class AppModule {}
