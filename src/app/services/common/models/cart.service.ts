import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { CreateCartItem } from 'src/app/contracts/cart/create-cart-item';
import { ListCartItem } from 'src/app/contracts/cart/list-cart-item';
import { UpdateCartItem } from 'src/app/contracts/cart/update-cart-item';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private httpClientService: HttpClientService) {

  }

  async getCartItems() {
    const allCartItems$ = this.httpClientService.get<ListCartItem[]>({
      controller: "carts",
      action: "GetCartItems"
    });

    const allCartItems = await lastValueFrom(allCartItems$);
    return allCartItems;
  }

  async createCartItem(cartItem: CreateCartItem) {
    const beCreated$ = this.httpClientService.post({
      controller: "carts",
      action: "AddCartItem"
    }, cartItem);

    await lastValueFrom(beCreated$);
  }

  async updateCartItem(cartItem: UpdateCartItem) {
    const beUpdated$ = this.httpClientService.put({
      controller: "carts",
      action: "UpdateCartItem"
    }, cartItem);

    await lastValueFrom(beUpdated$);
  }

  async deleteCartItem(cartItemId: string) {
    const beDeleted$ = this.httpClientService.delete({
      controller: "carts",
      action: "DeleteCartItem",
    }, cartItemId);

    await lastValueFrom(beDeleted$);
  }
}
