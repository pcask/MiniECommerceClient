import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { List_Product } from 'src/app/contracts/products/list_product';
import { FileService } from 'src/app/services/common/models/file.service';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  constructor(
    private productService: ProductService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService,
    private fileService: FileService
  ) { }


  products: List_Product[];
  totalProductCount: number;
  totalPageCount: number;
  pageNumberList: number[];
  currentPageNo: number = 1;
  productCountInPage: number = 16;
  storageBaseUrl: string;
  currentUrl: string;
  async ngOnInit() {

    this.storageBaseUrl = (await this.fileService.getStorageBaseUrl()).url;

    await this.loadProducts();

  }

  async loadProducts() {

    this.activatedRoute.queryParams.subscribe(async params => {

      this.currentPageNo = parseInt(params["page"] ?? 1);

      this.spinner.show(SpinnerType.BallScaleMultiple);

      const data: { totalProductCount: number, products: List_Product[] } = await this.productService
        .read(this.currentPageNo - 1, this.productCountInPage, 1, params["fb"], params["ob"]);

      this.spinner.hide(SpinnerType.BallScaleMultiple);

      this.totalProductCount = data.totalProductCount;
      this.totalPageCount = Math.ceil(this.totalProductCount / this.productCountInPage);

      if (this.totalPageCount > 1)
        this.loadPaginator();

      this.products = data.products.map<List_Product>(p => {

        const path: string = p.productImageFiles.length ? this.storageBaseUrl + "/" + p.imagePath + "/" +
          (p.productImageFiles.find(pf => pf.showcase == true) !== undefined ? p.productImageFiles.find(pf => pf.showcase == true).fileName : "") : "";

        const listProduct: List_Product = {
          id: p.id,
          name: p.name,
          brandCode: p.brandCode,
          brandName: p.brandName,
          amountOfStock: p.amountOfStock,
          price: p.price,
          imagePath: path,
          productImageFiles: p.productImageFiles,
          createdDate: p.createdDate,
          updatedDate: p.updatedDate
        }

        return listProduct;

      });

    });

  }

  async onSelectChangeEvent(event: any) {

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { ob: event.target.value },
      // preserve the existing query params in the route
      // If there is a key collision (çatışma, yani aynı isimde yeni bir params eklenirse), the new value is used.
      queryParamsHandling: 'merge',

      // When true, navigates without pushing a new state into history. (aynı zamanda url kısmında eklenen yeni parametre görülmeyecektir)
      // skipLocationChange: true
    });

  }

  async loadPaginator() {

    this.pageNumberList = [];

    if (this.totalPageCount < 7) {
      for (let i = 2; i < 7; i++) {
        if (this.totalPageCount == i) {
          for (let k = 1; k <= i; k++) {
            this.pageNumberList.push(k);
          }
          break;
        }
      }
    }
    else {
      if (this.currentPageNo - 3 <= 0)
        for (let i = 1; i <= 7; i++)
          this.pageNumberList.push(i);
      else if (this.currentPageNo + 3 >= this.totalPageCount)
        for (let i = this.totalPageCount - 6; i <= this.totalPageCount; i++)
          this.pageNumberList.push(i);
      else
        for (let i = this.currentPageNo - 3; i <= this.currentPageNo + 3; i++)
          this.pageNumberList.push(i);
    }
  }

  async onPageChangeEvent(event: any) {
    const selectedPage = event.target.accessKey;

    this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: { page: selectedPage },
      // preserve the existing query params in the route
      // If there is a key collision (çatışma, yani aynı isimde yeni bir params eklenirse), the new value is used.
      queryParamsHandling: 'merge',

      // When true, navigates without pushing a new state into history. (aynı zamanda url kısmında eklenen yeni parametre görülmeyecektir)
      // skipLocationChange: true
    });

  }

  generateLink(product: List_Product): string {

    let link = "/product/" + (product.brandName.replace(/[\W_]+/g, "-") + "/" + product.name.replace(/[\W_]+/g, "-")).toLowerCase() + "-i-" + product.id;

    return link;
  }
}
