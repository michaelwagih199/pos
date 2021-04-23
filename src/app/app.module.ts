import { BrowserModule } from '@angular/platform-browser';
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { authInterceptorProviders } from './_helpers/auth.interceptor';
import { CreateCategoryComponent } from './stock/dialog/create-category/create-category.component';
import { CreateProductComponent } from './stock/dialog/create-product/create-product.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ExcelService } from './excel.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule,
    NgxBarcodeModule,
  ],
  
  providers: [authInterceptorProviders,ExcelService],
  bootstrap: [AppComponent],
  entryComponents: [CreateCategoryComponent, CreateProductComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class AppModule {}
