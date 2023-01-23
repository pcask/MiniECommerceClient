import { Injectable } from "@angular/core";
import { BehaviorSubject, filter, from, map, mergeMap, Observable, of, pipe, reduce } from "rxjs";
import { CartService } from "src/app/services/common/models/cart.service";
import { List } from 'immutable';
import { CartItem } from "src/app/contracts/cart/cart-item";


@Injectable({
    providedIn: 'root'
})
export class CartRepo {

    private _cartItems: BehaviorSubject<List<CartItem>> = new BehaviorSubject(List([]));

    constructor(private cartService: CartService) {
        this.loadInitialData();
    }

    get cartItems() {
        return this._cartItems.asObservable();
    }

    get activeCartItems() {

        return this.cartItems.pipe(map(items => items.filter(item => item.isActive)));
    }

    get subTotal() {

        return this.activeCartItems.pipe(map(items => items.reduce((a, ci) => a + (ci.quantity * ci.price), 0)));
    }

    get totalItemCount(){
        return this.cartItems.pipe(map(items => items.reduce((a, ci) => a + ci.quantity, 0)));
    }
    get totalActiveItemCount(){
        
        return this.activeCartItems.pipe(map(items => items.reduce((a, ci) => a + ci.quantity, 0)));
       
    }

    loadInitialData() {
        this.cartService.getCartItems()
            .pipe(map(items => items.map(item => ({
                ...item,
                productLink: this.generateLink(item)
            }))))
            .subscribe(res => {
                this._cartItems.next(List(res));
            });

    }

    generateLink(cartItem: CartItem): string {

        let link = "/product/"
            + (cartItem.brandName.replace(/[\W_]+/g, "-")
                + "/"
                + cartItem.productName.replace(/[\W_]+/g, "-")).toLowerCase()
            + "-i-"
            + cartItem.productId;

        return link;
    }

    addCartItem(newCartItem: CartItem) {

        let obs = this.cartService.createCartItem(newCartItem);

        obs.subscribe(
            res => {
                let tempList = this._cartItems.getValue();
                let currentItem = tempList.find(ci => ci.productId === newCartItem.productId);

                if (currentItem) {

                    currentItem.quantity++;
                    let index = tempList.findIndex(ci => ci.productId === newCartItem.productId);
                    tempList.set(index, currentItem);

                    this._cartItems.next(tempList);
                }
                else
                    this._cartItems.next(this._cartItems.getValue().unshift(newCartItem)); // push() en sona eklerken unsift() en başa ekliyor.

            });

        return obs;
    }

    updateCartItem(beUpdated: CartItem) {

        let obs = this.cartService.updateCartItem(beUpdated);

        obs.subscribe(res => {
            // getValue ile gelen List<CartItem> 'ı map leyip yeni bir dizi döndürmemiz gerekiyor aksi halde, herhangi bir item güncellemesi sonrası 
            // next ile yine aynı List<CartItem> 'ı yayınlamış oluyoruz ve değişikliği ALGILAMIYOR ve bu koskaca 1 günüme mal oldu shit :/
            let tempList = this._cartItems.getValue().map(item => ({ ...item }));
            let currentItem = tempList.find(ci => ci.cartItemId === beUpdated.cartItemId);

            if (currentItem) {
                currentItem.quantity = beUpdated.quantity;
                currentItem.isActive = beUpdated.isActive;
                this._cartItems.next(tempList);
            }
            else
                console.log("Cart item was not found to update!!!");
        });
    }

    deleteCartItem(cartItemId: string) {
        let obs = this.cartService.deleteCartItem(cartItemId);

        obs.subscribe(res => {
            let tempList = this._cartItems.getValue();
            let currentItem = tempList.find(ci => ci.cartItemId === cartItemId);

            if (currentItem) {

                let index = tempList.findIndex(ci => ci.cartItemId === cartItemId);
                this._cartItems.next(tempList.delete(index));
            }
            else
                console.log("Cart item was not found to delete!!!");
        });
    }
}


