import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Product } from 'src/app/contracts/create_product';
import { Update_Product } from 'src/app/contracts/update_product';
import { DialogResults } from 'src/app/dialogs/base/base-dialog';
import { UpdateDialogComponent } from 'src/app/dialogs/update-dialog/update-dialog.component';
import { AlertifyService, AlertifyMessageType, AlertifyPosition } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';

declare var $: any;

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(
    spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    private productService: ProductService,
    private dialogService: DialogService) {
    super(spinner);
  }

  ngOnInit(): void {

  }

  @Output() createProductEvent: EventEmitter<Create_Product> = new EventEmitter();

  createProduct(name: HTMLInputElement, stock: HTMLInputElement, price: HTMLInputElement) {
    this.showSpinner(SpinnerType.BallScaleMultiple);
    const createProduct: Create_Product = new Create_Product();
    createProduct.name = name.value;
    createProduct.amountOfStock = parseInt(stock.value);
    createProduct.price = parseFloat(price.value);

    this.productService.create(createProduct, () => {
      this.hideSpinner(SpinnerType.BallScaleMultiple);
      this.alertify.Notify("Ürün başarıyla eklendi.", {
        dismissOther: true,
        messageType: AlertifyMessageType.Success,
        position: AlertifyPosition.TopRight,
        delay: 3
      });
      this.createProductEvent.emit();
    }, (ErrorMessage: string) => {
      this.alertify.Notify(ErrorMessage, {
        dismissOther: true,
        messageType: AlertifyMessageType.Error,
        position: AlertifyPosition.BottomLeft,
        delay: 5
      })
    });
  }

  product: Update_Product;

  loadUpdateForm(data: Update_Product) {
    this.product = data;

    $("#title")[0].innerText = "Update Product";
    $("#txtName")[0].value = data.name;
    $("#txtStock")[0].value = data.amountOfStock;
    $("#txtPrice")[0].value = data.price;

    $("#btnCreate").addClass("invisible");
    $("#btnCancel").removeClass("invisible");
    $("#btnUpdate").removeClass("invisible");

  }

  cancelProductUpdate() {

    this.product = null;

    $("#title")[0].innerText = "Create Product";
    $("#txtName")[0].value = "";
    $("#txtStock")[0].value = 0;
    $("#txtPrice")[0].value = 0;

    $("#btnCreate").removeClass("invisible");
    $("#btnCancel").addClass("invisible");
    $("#btnUpdate").addClass("invisible");

  }

  @Output() updateProductEvent: EventEmitter<any> = new EventEmitter();

  updateProduct(name: HTMLInputElement, stock: HTMLInputElement, price: HTMLInputElement) {

    if (this.product) {
      this.dialogService.openDialog({
        componentType: UpdateDialogComponent,
        data: [DialogResults.Yes, "Ürünü güncellemek üzeresiniz!"],
        options: { width: "450px" },
        afterClosedCallBack: () => {
          this.showSpinner(SpinnerType.BallScaleMultiple);

          this.product.name = name.value;
          this.product.amountOfStock = parseInt(stock.value);
          this.product.price = parseInt(price.value);

          this.productService.update(this.product, () => {

            this.cancelProductUpdate();
            this.updateProductEvent.emit();
            this.hideSpinner(SpinnerType.BallScaleMultiple);

            this.alertify.Notify("Ürün başarıyla güncellendi.", {
              dismissOther: true,
              messageType: AlertifyMessageType.Success,
              position: AlertifyPosition.TopRight,
              delay: 2
            });
          }, (errMessage: string) => {
            this.hideSpinner(SpinnerType.BallScaleMultiple);
            this.alertify.Notify("Ürün güncelleme işlemi başarısız. Lütfen sayfayı yenileyip tekrar deneyiniz.", {
              dismissOther: true,
              messageType: AlertifyMessageType.Error,
              position: AlertifyPosition.TopRight,
              delay: 3
            });
          })

        }
      });
    }

  }

}
