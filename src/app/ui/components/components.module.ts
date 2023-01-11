import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsModule } from './products/products.module';
import { HomeModule } from './home/home.module';
import { RegisterModule } from './register/register.module';
import { LoginModule } from './login/login.module';
import { ProductDetailsModule } from './product-details/product-details.module';
import { CartsModule } from './carts/carts.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ProductsModule,
    ProductDetailsModule,
    HomeModule,
    RegisterModule,
    LoginModule,
    CartsModule
  ],
  exports: [
    CartsModule
  ]
})
export class ComponentsModule { }
