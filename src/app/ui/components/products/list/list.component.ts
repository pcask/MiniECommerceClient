import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/base/base.component';
import { List_Product } from 'src/app/contracts/products/list_product';
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
    spinner: NgxSpinnerService
  ) { }


  products: List_Product[];
  currentPageNo: number;
  productCountInPage: number = 20;

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe(async params => {

      this.currentPageNo = parseInt(params["page"] ?? 1);


      const data: { totalProductCount: number, products: List_Product[] } = await this.productService
        .read(this.currentPageNo - 1, this.productCountInPage, 1, params["fb"]);

      this.products = data.products.map<List_Product>(p => {

        const listProduct: List_Product = {
          id: p.id,
          name: p.name,
          brandCode: p.brandCode,
          amountOfStock: p.amountOfStock,
          price: p.price,
          imagePath: p.productImageFiles.length ? p.imagePath + "/" + p.productImageFiles.find(pf => pf.showcase == true).fileName : "",
          productImageFiles: p.productImageFiles,
          createdDate: p.createdDate,
          updatedDate: p.updatedDate
        }

        return listProduct;

      });

    })

  }
}
