import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { CreateCartItem } from 'src/app/contracts/cart/create-cart-item';
import { List_Product } from 'src/app/contracts/products/list_product';
import { ComponentType, DynamicLoadComponentService } from 'src/app/services/common/dynamic-load-component.service';
import { CartService } from 'src/app/services/common/models/cart.service';
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

  @ViewChild('viewContainerRef', { read: ViewContainerRef, static: true })
  public myViewContainer: ViewContainerRef

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private fileService: FileService,
    private cartService: CartService,
    private spinnerService: NgxSpinnerService,
    private dynamicLoadComponentService: DynamicLoadComponentService
  ) {

  }


  product: List_Product = null;
  storageBaseUrl: string = null;

  async ngOnInit(): Promise<void> {

    await this.loadProduct().then(d => {
      // Zoom Js dosyasının tüm sayfa yüklendikten sonra yüklenmesi gerekiyor angular lifecycle daki eventler ihtiyacımı karşılamadığı için
      // küçük bir ms bekledikten sonra js func'ı çağırıyorum. 
      setTimeout(() => {
        imageZoom("productImage", "imgLens", "imageZoomedArea");
      }, 200);

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

  async addToCart(productId: string, event: any) {
    var button = $(event.target)

    this.spinnerService.show(SpinnerType.BallScaleMultiple);
    const cartItem: CreateCartItem = {
      ProductId: productId,
      Quantity: 1
    };

    await this.cartService.createCartItem(cartItem)

    this.spinnerService.hide(SpinnerType.BallScaleMultiple);

    this.loadMiniCart();

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

  loadMiniCart() {
    this.dynamicLoadComponentService.loadComponent(ComponentType.MiniCartComponent, this.myViewContainer);
    $("#miniCartWrapper").fadeIn();
  }

  hideMiniCart() {
    $("#miniCartWrapper").fadeOut();
  }
}

