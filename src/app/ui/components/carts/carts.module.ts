import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartsComponent } from './carts.component';
import { RouterModule } from '@angular/router';
import { GetCartItemsComponent } from './get-cart-items/get-cart-items.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MiniCartComponent } from './mini-cart/mini-cart.component';
import { CustomNgIfDirective } from 'src/app/directives/ui/custom-ng-if.directive';


@NgModule({
  declarations: [
    CartsComponent,
    GetCartItemsComponent,
    MiniCartComponent,
    CustomNgIfDirective,
  ],
  imports: [
    CommonModule,
    MatCheckboxModule,
    RouterModule.forChild([{
      path: "", component: CartsComponent
    }])
  ],
  exports: [
    MiniCartComponent
  ]
})
export class CartsModule { }
