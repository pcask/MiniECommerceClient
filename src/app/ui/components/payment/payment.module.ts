import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { RouterModule } from '@angular/router';
import { AddUserAddressModule } from 'src/app/services/ui/add-user-address/add-user-address.module';



@NgModule({
  declarations: [
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    AddUserAddressModule,
    RouterModule.forChild([{
      path: "", component: PaymentComponent
    }])
  ]
})
export class PaymentModule { }
