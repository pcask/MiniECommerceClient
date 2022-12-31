import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { List_Product } from 'src/app/contracts/products/list_product';
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private productService: ProductService,
    private fileService: FileService
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


  async getStorageURL(): Promise<string> {
    return (await this.fileService.getStorageBaseUrl()).url
  }

}

