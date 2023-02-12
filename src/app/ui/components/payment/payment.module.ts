import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentComponent } from './payment.component';
import { RouterModule } from '@angular/router';
import { UserAddressModalModule } from 'src/app/services/ui/user-address-modal/user-address-modal.module';



@NgModule({
  declarations: [
    PaymentComponent,
  ],
  imports: [
    CommonModule,
    UserAddressModalModule,
    RouterModule.forChild([{
      path: "", component: PaymentComponent
    }])
  ]
})
export class PaymentModule { }
