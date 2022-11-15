import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Create_Product } from 'src/app/contracts/create_product';
import { AlertifyService, AlertifyMessageType, AlertifyPosition } from 'src/app/services/admin/alertify.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private alertify: AlertifyService, private productService: ProductService) {
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

}
