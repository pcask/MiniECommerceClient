import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { CartItem } from 'src/app/contracts/cart/cart-item';
import { List_Product } from 'src/app/contracts/products/list_product';
import { CartRepo } from 'src/app/repositories/ui/cartRepo';
import { ComponentType, DynamicLoadComponentService } from 'src/app/services/common/dynamic-load-component.service';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $: any
declare function imageZoom(imgId, lensId, resultId): any

@Component({
  selector: 'app-get-product',
  templateUrl: './get-product.component.html',
  styleUrls: ['./get-product.component.scss']
})

export class GetProductComponent implements OnInit {

  // Dynamic Component Reload kullanımı için
  // @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true })
  // public myViewContainer: ViewContainerRef

  product: List_Product = null;
  storageBaseUrl: string = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private fileService: FileService,
    private spinnerService: NgxSpinnerService,
    private dynamicLoadComponentService: DynamicLoadComponentService,
    private cartRepo: CartRepo,
    private router: Router
  ) {

  }

  async ngOnInit(): Promise<void> {

    await this.loadProduct().then(d => {
      // Zoom Js dosyasının tüm sayfa yüklendikten sonra yüklenmesi gerekiyor angular life-cycle daki eventler ihtiyacımı karşılamadığı için
      // küçük bir ms bekledikten sonra js func'ı çağırıyorum. 
      setTimeout(() => {
        imageZoom("productImage", "imgLens", "imageZoomedArea");
      }, 300);

    });

  }

  async loadProduct() {


    this.activatedRoute.params.subscribe(async param => {

      const ps = param["productName&id"];
      const productId = ps.substring(ps.indexOf("-i-") + 3);

      const obj: any = await this.productService.getProductById(productId);
      const p = obj.product;

      const path: string = p.productImageFiles.length ? await this.getStorageURL() + "/" + p.productImageFiles[0].path + "/" +
        (p.productImageFiles.find(pf => pf.showcase == true) !== undefined ? p.productImageFiles.find(pf => pf.showcase == true).fileName : "") : "";

      p.imagePath = path;

      this.product = p;
    });

  }

  async addToCart(product: List_Product, event: any) {
    var button = $(event.target)

    this.spinnerService.show(SpinnerType.BallScaleMultiple);

    const cartItem: CartItem = {
      productId: product.id,
      productName: product.name,
      brandCode: product.brandCode,
      brandName: product.brandName,
      imagePath: product.imagePath,
      productLink: this.router.url,
      quantity: 1,
      isActive: true,
      price: product.price,
    }

    this.cartRepo.addCartItem(cartItem);

    this.spinnerService.hide(SpinnerType.BallScaleMultiple);

    $(".my-cart-dropdown-content").addClass("active");
    // this.loadMiniCart();

    button.css("pointer-events", "none");
    button.css("background-color", "#059925");
    button.val("Added to Cart");

    setTimeout(() => {
      button.css("pointer-events", "unset");
      button.css("background-color", "#673ab7");
      button.val("Add to Cart");
    }, 2500);
  }

  async getStorageURL(): Promise<string> {
    return (await this.fileService.getStorageBaseUrl()).url
  }

  // MiniCartComponent'ini yeniden yüklemek gibi bir fikir ile yola çıktığım için yazmıştım. 
  // Bu senaryo için gereksiz bir düşünceydi fakat Dynamic Component Reload 'a çalışan bir örnek teşkil ettiği için silmiyorum.
  // loadMiniCart() {
  //   this.dynamicLoadComponentService.loadComponent(ComponentType.MiniCartComponent, this.myViewContainer);
  //   $("#miniCartWrapper").fadeIn();
  // }

  // hideMiniCart() {
  //   $("#miniCartWrapper").fadeOut();
  // }
}

