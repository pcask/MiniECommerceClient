import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { CartRepo } from 'src/app/repositories/ui/cartRepo';
import { AuthService } from 'src/app/services/common/auth.service';
import { List } from 'immutable';
import { CartItem } from 'src/app/contracts/cart/cart-item';

declare var $: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  constructor(
    private authService: AuthService,
    private cartRepo: CartRepo
  ) {

  }

  cartItems$: Observable<List<CartItem>>;
  subTotal$;
  totalActiveItemCount$;

  ngOnInit(): void {

    this.cartItems$ = this.cartRepo.activeCartItems;
    this.subTotal$ = this.cartRepo.subTotal;
    this.totalActiveItemCount$ = this.cartRepo.totalActiveItemCount;

  }



}
