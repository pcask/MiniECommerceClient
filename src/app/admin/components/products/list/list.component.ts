import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Product } from 'src/app/contracts/list_product';
import { AlertifyService, MessageType, Position } from 'src/app/services/admin/alertify.service';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(spinnerService: NgxSpinnerService, private productService: ProductService, private alertify: AlertifyService) {
    super(spinnerService)
  }

  displayedColumns: string[] = ['name', 'amountOfStock', 'price', 'createdDate', 'updatedDate', 'edit', 'seperator', 'delete'];
  dataSource: MatTableDataSource<List_Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async ngOnInit() {
    await this.getProducts()
  }

  async pageChanged() {
    await this.getProducts();
  }

  async getProducts() {
    const allProducts: { totalCount: number; products: List_Product[] } = await this.productService.read(this.paginator ? this.paginator.pageIndex : 0, this.paginator ? this.paginator.pageSize : 5, () => {
      this.hideSpinner(SpinnerType.BallScaleMultiple);
    }, (errorMessage) => {
      this.alertify.Notify(errorMessage, {
        dismissOther: true,
        messageType: MessageType.Error,
        position: Position.TopRight,
        delay: 3
      })
    });

    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    this.paginator.length = allProducts.totalCount;
  }
}



