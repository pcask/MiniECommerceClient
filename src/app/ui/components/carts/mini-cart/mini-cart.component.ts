import { Component, OnInit } from '@angular/core';
import { List_Brand } from 'src/app/contracts/brands/list_brand';
import { ListCartItem } from 'src/app/contracts/cart/list-cart-item';
import { AuthService } from 'src/app/services/common/auth.service';
import { BrandService } from 'src/app/services/common/models/brand.service';
import { CartService } from 'src/app/services/common/models/cart.service';
import { FileService } from 'src/app/services/common/models/file.service';

@Component({
  selector: 'app-mini-cart',
  templateUrl: './mini-cart.component.html',
  styleUrls: ['./mini-cart.component.scss']
})
export class MiniCartComponent implements OnInit {

  cartItems: ListCartItem[] = [];
  storageUrl: string;
  totalItemCount: number;

 
  constructor(
    public authService: AuthService,
    private fileService: FileService,
    private brandService: BrandService,
    private cartService: CartService
  ) {

    authService.identityCheck();
  }

  async ngOnInit(): Promise<void> {

    this.storageUrl = await this.getStorageURL();

    if (this.authService.isAuthenticated)
      await this.loadCartItems();
  }


  async loadCartItems() {

    this.totalItemCount = 0;

    this.cartItems = await this.cartService.getCartItems();

    this.cartItems.forEach(async ci => {

      if (ci.isActive == true) {
        this.totalItemCount += ci.quantity;
      }

      const brand: List_Brand = await this.brandService.getBrandByProductId(ci.productId);

      ci.brandCode = brand.code;
      ci.brandName = brand.name;

      ci.productLink = this.generateLink(ci);

    });


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

  async getStorageURL(): Promise<string> {
    return (await this.fileService.getStorageBaseUrl()).url;
  }

}
