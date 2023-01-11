import { Component, OnInit } from '@angular/core';
import { List_Brand } from 'src/app/contracts/brands/list_brand';
import { ListCartItem } from 'src/app/contracts/cart/list-cart-item';
import { UpdateCartItem } from 'src/app/contracts/cart/update-cart-item';
import { AuthService } from 'src/app/services/common/auth.service';
import { BrandService } from 'src/app/services/common/models/brand.service';
import { CartService } from 'src/app/services/common/models/cart.service';
import { FileService } from 'src/app/services/common/models/file.service';

declare var $: any;
declare var bootstrap: any;

@Component({
  selector: 'app-get-cart-items',
  templateUrl: './get-cart-items.component.html',
  styleUrls: ['./get-cart-items.component.scss']
})
export class GetCartItemsComponent implements OnInit {

  constructor(
    private cartService: CartService,
    private fileService: FileService,
    private brandService: BrandService,
    private authService: AuthService
  ) { }

  cartItems: ListCartItem[] = [];
  storageUrl: string;
  totalItemCount: number;
  subTotalPrice: number;

  async ngOnInit(): Promise<void> {

    if (this.authService.isAuthenticated) {

      this.storageUrl = await this.getStorageURL();

      await this.loadCartItems();

      setTimeout(() => {
        this.setElementsEvent();
      }, 150);

    }
    
  }

  async loadCartItems() {

    this.totalItemCount = 0;
    this.subTotalPrice = 0

    this.cartItems = await this.cartService.getCartItems();

    this.cartItems.forEach(async ci => {

      if (ci.isActive == true) {
        this.totalItemCount += ci.quantity;
        this.subTotalPrice += ci.quantity * ci.price;
      }

      const brand: List_Brand = await this.brandService.getBrandByProductId(ci.productId);

      ci.brandCode = brand.code;
      ci.brandName = brand.name;

      ci.productLink = this.generateLink(ci);

    });


  }

  async updateCartItem(item: ListCartItem, _quantity?: number, _isActive?: boolean) {

    let beUpdated: UpdateCartItem = new UpdateCartItem();
    beUpdated.cartItemId = item.cartItemId;

    if (_quantity && _quantity > 0) {
      beUpdated.quantity = _quantity;
      beUpdated.isActive = item.isActive;
    }
    else {
      beUpdated.isActive = !_isActive;
      beUpdated.quantity = item.quantity;
    }

    await this.cartService.updateCartItem(beUpdated);
    await this.ngOnInit();
  }

  async remevoCartItem(item: ListCartItem) {

    await this.cartService.deleteCartItem(item.cartItemId);
    await this.ngOnInit();
  }

  async getStorageURL(): Promise<string> {
    return (await this.fileService.getStorageBaseUrl()).url;
  }

  generateLink(cartItem: ListCartItem): string {

    let link = "/product/"
      + (cartItem.brandName.replace(/[\W_]+/g, "-")
        + "/"
        + cartItem.productName.replace(/[\W_]+/g, "-")).toLowerCase()
      + "-i-"
      + cartItem.productId;

    return link;
  }

  async onButtonClick(item, event) {

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
      await this.updateCartItem(item, value);
    }

  }

  async onQuantityChange(item: ListCartItem, event: any) {

    var valueText = event.target.oldValue;

    if (valueText == "" || valueText == " ") {
      valueText = "1";
      $(event.target).val(valueText);
    }

    var value = parseInt(valueText);

    if (value !== item.quantity && !Number.isNaN(value))
      await this.updateCartItem(item, value);
  }

  showDeleteModal(item: ListCartItem, event: any) {

    const deleteModal = new bootstrap.Modal('#deleteModal');

    $("#mbb-pr-name").text(item.productName);

    $("#modalRemoveBtn").bind("click", () => {
      this.remevoCartItem(item);
    });

    $("#btnRemoveAddFavorites").bind("click", () => {
      this.remevoCartItem(item);

      // todo: Add this item to favorites

      deleteModal.hide();

    });

    deleteModal.show();

  }


  setElementsEvent() {

    $.each($(".number-text"), function (i, e) {

      setInputFilter(e, function (value) {
        return /^[0-9\s]*$/.test(value);
      })
    });

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

