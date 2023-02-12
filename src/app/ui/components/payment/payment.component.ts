import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { CartRepo } from 'src/app/repositories/ui/cartRepo';
import { AuthService } from 'src/app/services/common/auth.service';
import { List } from 'immutable';
import { CartItem } from 'src/app/contracts/cart/cart-item';
import { UserAddressService } from 'src/app/services/common/models/user-address.service';
import { UserAddress } from 'src/app/contracts/user-address/user-address';
import { UserAddressModalComponent } from 'src/app/services/ui/user-address-modal/user-address-modal.component';

declare var $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private userAddressService: UserAddressService,
    private cartRepo: CartRepo
  ) {

  }

  cartItems$: Observable<List<CartItem>>;
  subTotal$: Observable<number>;
  totalActiveItemCount$: Observable<number>;
  userAddresses: UserAddress[];
  activeUserAddress: UserAddress = new UserAddress(); // İlk atamayı yapmazsak değeri atanana kadar template'de erişirken console'da undefined hatası alacağız.

  @ViewChild(UserAddressModalComponent) userAddressModalComponent: UserAddressModalComponent;

  async ngOnInit(): Promise<void> {

    this.cartItems$ = this.cartRepo.activeCartItems;
    this.subTotal$ = this.cartRepo.subTotal;
    this.totalActiveItemCount$ = this.cartRepo.totalActiveItemCount;

    await this.loadUserAddresses();
  }

  async loadUserAddresses() {
    const obj: any = await this.userAddressService.getUserAddresses();
    this.userAddresses = obj.userAddresses;

    this.activeUserAddress = this.userAddresses.find(a => a.showcase == true);
  }

  async setDeliveryAddress(id: string) {

    await this.userAddressService.setUserAddressToShowcase(id);

    await this.loadUserAddresses();
  }

  loadUserAddressModalToEdit(add: UserAddress) {
    this.userAddressModalComponent.loadUserAddressModalToEdit(add);
  }

  loadUserAddressModalToAdd(){
    this.userAddressModalComponent.loadUserAddressModalToAdd();
  }
}


