import { Pipe, PipeTransform } from '@angular/core';
import { List } from 'immutable';
import { CartItem } from 'src/app/contracts/cart/cart-item';

@Pipe({
    name: 'totalCount'
})
export class TotalCountPipe implements PipeTransform {
    transform(cartList: List<CartItem>) {
        let totalCount = 0;
        if (cartList) {
            cartList.forEach(ci => {
                if (ci.isActive)
                    totalCount += ci.quantity;
            })
        }

        return totalCount;
    }
}

@Pipe({
    name: 'subTotal'
})
export class SubTotalPipe implements PipeTransform {
    transform(cartList: List<CartItem>) {

        let subTotal = 0;
        if (cartList) {
            cartList.forEach(ci => {
                if (ci.isActive)
                    subTotal += ci.quantity * ci.price;
            })
        }

        return subTotal;
    }
}