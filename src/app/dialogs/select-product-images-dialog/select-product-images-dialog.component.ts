import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatLegacyDialogRef as MatDialogRef, MAT_LEGACY_DIALOG_DATA as MAT_DIALOG_DATA } from '@angular/material/legacy-dialog';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { List_Product_Image } from 'src/app/contracts/products/list_product_Image';
import { AlertifyMessageType, AlertifyPosition, AlertifyService } from 'src/app/services/admin/alertify.service';
import { DialogService } from 'src/app/services/common/dialog.service';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { ProductService } from 'src/app/services/common/models/product.service';
import { BaseDialog, DialogResults } from '../base/base-dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

declare var $: any;

@Component({
  selector: 'app-select-product-images-dialog',
  templateUrl: './select-product-images-dialog.component.html',
  styleUrls: ['./select-product-images-dialog.component.scss']
})
export class SelectProductImagesDialogComponent extends BaseDialog<SelectProductImagesDialogComponent> implements OnInit {

  constructor(
    dialogRef: MatDialogRef<SelectProductImagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogResults | string,
    private productService: ProductService,
    private spinner: NgxSpinnerService,
    private alertify: AlertifyService,
    private dialogService: DialogService) {
    super(dialogRef);
  }

  @Output() options: Partial<FileUploadOptions> = {
    accept: ".png, .jpg, .jpeg, .gif",
    controller: "products",
    action: "upload",
    explanation: "Ürün görsellerini buraya sürükleyin veya seçin. -->",
    isAdminPage: true,
    queryString: `id=${this.data}`,
    successCallBack: async () => { return await this.loadImages() }
  };

  productImages: List_Product_Image[];

  async ngOnInit() {

    return await this.loadImages();

  }

  async loadImages() {
    this.spinner.show(SpinnerType.BallScaleMultiple);
    this.productImages = await this.productService.getImagesByProductId(this.data as string, () => {
      this.spinner.hide(SpinnerType.BallScaleMultiple);
    }, (errorMessage: string) => {
      this.spinner.hide(SpinnerType.BallScaleMultiple);
      this.alertify.Notify("Ürün görselleri yüklenemedi. Lütfen sayfayı yenileyip tekrar deneyiniz.", {
        dismissOther: true,
        messageType: AlertifyMessageType.Error,
        position: AlertifyPosition.TopRight,
        delay: 4
      });
    });
  }

  async deleteImage(imageId: string, event: any) {

    this.dialogService.openDialog({
      componentType: DeleteDialogComponent,
      data: [DialogResults.Yes, "Görseli kalıcı olarak silmek üzeresiniz!"],
      afterClosedCallBack: async () => {

        this.spinner.show(SpinnerType.BallScaleMultiple);
        var card = $(event.srcElement).parent().parent();
        card.fadeOut(600);

        await this.productService.deleteImage(this.data as string, imageId, async () => {
          // await this.loadImages();
          this.spinner.hide(SpinnerType.BallScaleMultiple);
          this.alertify.Notify("Görsel başarıyla silindi.", {
            dismissOther: true,
            messageType: AlertifyMessageType.Success,
            position: AlertifyPosition.TopRight,
            delay: 2
          });
        }, (errorMessage: string) => {
          this.spinner.hide(SpinnerType.BallScaleMultiple);
          this.alertify.Notify("Görsel silme işlemi başarısız. Lütfen sayfayı yenileyip tekrar deneyiniz.", {
            dismissOther: true,
            messageType: AlertifyMessageType.Error,
            position: AlertifyPosition.TopRight,
            delay: 3
          });
        });
      }
    });


  }
}
