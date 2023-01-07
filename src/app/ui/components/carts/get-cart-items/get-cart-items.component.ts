import { Component, OnInit } from '@angular/core';
import { ListCartItem } from 'src/app/contracts/cart/list-cart-item';
import { UpdateCartItem } from 'src/app/contracts/cart/update-cart-item';
import { CartService } from 'src/app/services/common/models/cart.service';
import { FileService } from 'src/app/services/common/models/file.service';

declare var $: any;

@Component({
  selector: 'app-get-cart-items',
  templateUrl: './get-cart-items.component.html',
  styleUrls: ['./get-cart-items.component.scss']
})
export class GetCartItemsComponent implements OnInit {

  constructor(
    private cartService: CartService,
    private fileService: FileService
  ) { }

  cartItems: ListCartItem[] = [];
  storageUrl: string;
  totalItemCount: number = 0;
  subTotalPrice: number;

  async ngOnInit(): Promise<void> {

    setTimeout(() => {
      this.setElementsEvent();
    }, 150);

    this.storageUrl = await this.getStorageURL();

    await this.loadCartItems();

  }

  async loadCartItems() {

    this.cartItems = await this.cartService.getCartItems();

    let _itemCount: number = 0;
    let _subTotal: number = 0;

    this.cartItems.forEach(function (value) {
      _itemCount += value.quantity;
      _subTotal += value.quantity * value.price;
    });

    this.totalItemCount = _itemCount;
    this.subTotalPrice = _subTotal;
  }

 

  async updateQuantity(item: ListCartItem, quantity:number){

    const beUpdated: UpdateCartItem = {
      cartItemId: item.cartItemId,
      quantity: quantity
    }

    await this.cartService.updateCartItem(beUpdated);
    await this.ngOnInit();

  }

  async getStorageURL(): Promise<string> {
    return (await this.fileService.getStorageBaseUrl()).url
  }

  async onButtonClick(item, event){

    var text = event.target.innerText;
    var numberText = $(event.target).siblings("input");
    var value = parseInt(numberText.val());
    var flag: boolean = false;

    if (text == "+") {
      if (value < 10) {
        value++;
        flag = true;
      }
    }
    else {
      if (value > 1) {
        value--;
        flag = true;
      }
    }

    if (flag) {

      numberText.val(value).change();
      await this.updateQuantity(item,value);
    }

  }

  async onQuantityChange(item: ListCartItem, event: any) {

    var numberText = $(event.target);
    var value = parseInt(numberText.val());

    if (value !== item.quantity && !Number.isNaN(value))
     await this.updateQuantity(item,value);
  }

  setElementsEvent() {

    $.each($(".number-text"), function (i, e) {
      setInputFocusOut(e);
      setInputFilter(e, function (value) {
        return /^[0-9\s]*$/.test(value);
      })
    });

    // $.each($(".number-btn"), function (i, e) {
    //   setButtonClick(e);
    // });

  }

}

function setInputFilter(textbox: Element, inputFilter: (value: string) => boolean): void {
  ["input", "keydown", "keyup", "mousedown", "mouseup", "select", "contextmenu", "drop", "focusout"].forEach(function (event) {
    textbox.addEventListener(event, function (this: (HTMLInputElement | HTMLTextAreaElement) & { oldValue: string; oldSelectionStart: number | null, oldSelectionEnd: number | null }) {

      if (this.value.length > 1 && this.value.includes(" ")) {
        this.value = this.value.replace(/\s/g, "")
      }

      if (parseInt(this.value) > 10) {
        this.value = "10"
      }

      if (parseInt(this.value) == 0) {
        this.value = ""
      }

      if (inputFilter(this.value)) {
        this.oldValue = this.value;
        this.oldSelectionStart = this.selectionStart;
        this.oldSelectionEnd = this.selectionEnd;
      }
      else if (Object.prototype.hasOwnProperty.call(this, "oldValue")) {
        this.value = this.oldValue;

        if (this.oldSelectionStart !== null &&
          this.oldSelectionEnd !== null) {
          this.setSelectionRange(this.oldSelectionStart, this.oldSelectionEnd);
        }
      }
      else {
        this.value = "";
      }
    });
  });
}

function setInputFocusOut(textbox: Element) {
  textbox.addEventListener("focusout", (event: any) => {
    var value = event.target.oldValue;
    if (value == "" || value == " ") {
      $(event.target).val("1");
    }
  })
}

// function setButtonClick(button: Element) {
//   button.addEventListener("click", (event: any) => {

//     var text = event.target.innerText;
//     var numberText = $(event.target).siblings("input");
//     var value = parseInt(numberText.val());
//     var flag: boolean = false;

//     if (text == "+") {
//       if (value < 10) {
//         value++;
//         flag = true;
//       }
//     }
//     else {
//       if (value > 1) {
//         value--;
//         flag = true;
//       }
//     }

//     if (flag) {

//       numberText.bind("change", function () {
        
//       });

//       numberText.val(value).change();
//     }

//   });
// }
