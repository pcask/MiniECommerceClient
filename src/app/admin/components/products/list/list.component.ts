import { Component, EventEmitter, Injectable, OnInit, Output, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { List_Product } from 'src/app/contracts/products/list_product';
import { Update_Product } from 'src/app/contracts/products/update_product';
import { SelectProductImagesDialogComponent } from 'src/app/dialogs/select-product-images-dialog/select-product-images-dialog.component';
import { AlertifyService, AlertifyMessageType, AlertifyPosition } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $: any

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})

@Injectable()
export class ListComponent extends BaseComponent implements OnInit {

  constructor(
    spinnerService: NgxSpinnerService,
    private productService: ProductService,
    private alertify: AlertifyService,
    private dialogService: DialogService) {
    super(spinnerService)
  }

  displayedColumns: string[] = ['name', 'amountOfStock', 'price', 'createdDate', 'updatedDate', 'uploadImage', 'edit', 'delete'];
  dataSource: MatTableDataSource<List_Product>;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  async ngOnInit() {

    await this.getProducts();
  }


  @Output() updateProductEvent: EventEmitter<Update_Product> = new EventEmitter();

  updateProduct(_id: string, event: any) {

    var tr = $(event.srcElement).parent().parent().parent();

    var _name = tr[0].children[0].innerText;
    var _stock = tr[0].children[1].innerText;
    var _price = tr[0].children[2].innerText;

    this.updateProductEvent.emit({ id: _id, name: _name, amountOfStock: _stock, price: _price });

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

    const allProducts: { totalProductCount: number; products: List_Product[] } = await this.productService.read(this.paginator ? this.paginator.pageIndex : 0,
      this.paginator ? this.paginator.pageSize : 5, 0, null, () => {

        this.hideSpinner(SpinnerType.BallScaleMultiple);
      }, (errorMessage) => {

        this.hideSpinner(SpinnerType.BallScaleMultiple);
        // Global error handler yazdığımız için hata ilk olarak orada yakalanacak ve product service'den bize hata olarak;
        // EmptyError: no elements in sequence fırlatılacaktır.
        // this.alertify.Notify(errorMessage, {
        //   dismissOther: true,
        //   messageType: AlertifyMessageType.Error,
        //   position: AlertifyPosition.TopRight,
        //   delay: 3
        // });
      });


    this.dataSource = new MatTableDataSource<List_Product>(allProducts.products);
    this.paginator.length = allProducts.totalProductCount;

  }
}



