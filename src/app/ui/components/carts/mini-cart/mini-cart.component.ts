import { Component, OnInit } from '@angular/core';
import { List_Brand } from 'src/app/contracts/brands/list_brand';
import { ListCartItem } from 'src/app/contracts/cart/list-cart-item';
import { CartRepo } from 'src/app/repositories/ui/cartRepo';
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

  cartItems = this.cartRepo.activeCartItems;
  storageUrl: string;
 
  constructor(
    public authService: AuthService,
    private fileService: FileService,
    private cartRepo: CartRepo
  ) {

    authService.identityCheck();
  }

  async ngOnInit(): Promise<void> {

    this.storageUrl = await this.getStorageURL();
   
  }

  async getStorageURL(): Promise<string> {
    return (await this.fileService.getStorageBaseUrl()).url;
  }

}
