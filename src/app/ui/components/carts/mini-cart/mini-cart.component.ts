import { Component, OnInit } from '@angular/core';
import { CartRepo } from 'src/app/repositories/ui/cartRepo';
import { AuthService } from 'src/app/services/common/auth.service';
import { FileService } from 'src/app/services/common/models/file.service';

declare function imageZoom(imgId, lensId, resultId): any

@Component({
  selector: 'app-mini-cart',
  templateUrl: './mini-cart.component.html',
  styleUrls: ['./mini-cart.component.scss']
})
export class MiniCartComponent implements OnInit {

  cartItems = this.cartRepo.activeCartItems;
  storageUrl: string;
  totalCount;
  
 
  constructor(
    public authService: AuthService,
    private fileService: FileService,
    private cartRepo: CartRepo
  ) {

    authService.identityCheck();
  }

  async ngOnInit(): Promise<void> {

    this.storageUrl = await this.getStorageURL();
    this.totalCount = this.cartRepo.totalActiveItemCount;
   
  }

  async getStorageURL(): Promise<string> {
    return (await this.fileService.getStorageBaseUrl()).url;
  }

  loadImageZoom(){
    setTimeout(() => {
      imageZoom("productImage", "imgLens", "imageZoomedArea");
    }, 300);
  }
}
