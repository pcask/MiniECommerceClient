import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddUserAddressComponent } from './add-user-address.component';



@NgModule({
  declarations: [
    AddUserAddressComponent
  ],
  imports: [
    CommonModule
  ],
  exports:[
    AddUserAddressComponent
  ]
})
export class AddUserAddressModule { }
