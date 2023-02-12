import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserAddressModalComponent } from './user-address-modal.component';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [
    UserAddressModalComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  exports:[
    UserAddressModalComponent
  ]
})
export class UserAddressModalModule { }
