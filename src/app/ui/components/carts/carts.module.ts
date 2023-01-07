import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartsComponent } from './carts.component';
import { RouterModule } from '@angular/router';
import { GetCartItemsComponent } from './get-cart-items/get-cart-items.component';
import {MatCheckboxModule} from '@angular/material/checkbox';


@NgModule({
  declarations: [
    CartsComponent,
    GetCartItemsComponent
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    RouterModule.forChild([{
      path: "", component: CartsComponent
    }])
  ]
})
export class CartsModule { }
