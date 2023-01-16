import { Injectable } from '@angular/core';
import { CartItem } from 'src/app/contracts/cart/cart-item';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClientService: HttpClientService) {

  }

  getCartItems() {
    const allCartItems$ = this.httpClientService.get<CartItem[]>({
      controller: "carts",
      action: "GetCartItems"
    });

    return allCartItems$;
  }

  createCartItem(cartItem: CartItem) {
    const beCreated$ = this.httpClientService.post({
      controller: "carts",
      action: "AddCartItem"
    }, cartItem);

    return beCreated$;
  }

  updateCartItem(cartItem: CartItem) {
    const beUpdated$ = this.httpClientService.put({
      controller: "carts",
      action: "UpdateCartItem"
    }, cartItem);

    return beUpdated$;
  }

  deleteCartItem(cartItemId: string) {
    const beDeleted$ = this.httpClientService.delete({
      controller: "carts",
      action: "DeleteCartItem",
    }, cartItemId);

    return beDeleted$;
  }
}
