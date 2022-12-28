import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductDetailsComponent } from './product-details.component';
import { GetProductComponent } from './get-product/get-product.component';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
    ProductDetailsComponent,
    GetProductComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: "", component: ProductDetailsComponent
    }])
  ]
})
export class ProductDetailsModule { }
