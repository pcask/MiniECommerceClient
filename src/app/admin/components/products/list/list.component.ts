import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Product } from 'src/app/contracts/list_product';
import { SelectProductImagesDialogComponent } from 'src/app/dialogs/select-product-images-dialog/select-product-images-dialog.component';
import { AlertifyService, AlertifyMessageType, AlertifyPosition } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent extends BaseComponent implements OnInit {

  constructor(
    spinnerService: NgxSpinnerService,
    private productService: ProductService,
    private alertify: AlertifyService,
    private dialogService: DialogService) {
    super(spinnerService)
  }

  displayedColumns: string[] = ['name', 'amountOfStock', 'price', 'createdDate', 'updatedDate', 'uploadImage', 'seperator2', 'edit', 'seperator2', 'delete'];
  dataSource: MatTableDataSource<List_Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async ngOnInit() {
    
    await this.getProducts();
  }

  uploadProductImages(id: string) {
    this.dialogService.openDialog({
      componentType: SelectProductImagesDialogComponent,
      data: id,
      options: { width: "1400px" }
    });
  }

  async pageChanged() {
    await this.getProducts();
  }

  async getProducts() {

    this.showSpinner(SpinnerType.BallScaleMultiple);

    const allProducts: { totalCount: number; products: List_Product[] } = await this.productService.read(this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 5, () => {

        this.hideSpinner(SpinnerType.BallScaleMultiple);
      }, (errorMessage) => {

        this.alertify.Notify(errorMessage, {
          dismissOther: true,
          messageType: AlertifyMessageType.Error,
          position: AlertifyPosition.TopRight,
          delay: 3
        });
      });


    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    this.paginator.length = allProducts.totalCount;

  }
}



