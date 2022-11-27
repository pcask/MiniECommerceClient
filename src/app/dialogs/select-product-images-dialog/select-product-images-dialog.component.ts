import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
    explanation: "Drag or select product images here.. -->",
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
      this.alertify.Notify("An unexpected error has occurred. Please refresh the page and try again.", {
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
      data: [DialogResults.Yes, "You are about to permanently delete the image!"],
      afterClosedCallBack: async () => {

        this.spinner.show(SpinnerType.BallScaleMultiple);
        var card = $(event.srcElement).parent().parent();
        card.fadeOut(600);

        await this.productService.deleteImage(this.data as string, imageId, async () => {
          // await this.loadImages();
          this.spinner.hide(SpinnerType.BallScaleMultiple);
          this.alertify.Notify("The image has been successfully deleted.", {
            dismissOther: true,
            messageType: AlertifyMessageType.Success,
            position: AlertifyPosition.TopRight,
            delay: 2
          });
        }, (errorMessage: string) => {
          this.spinner.hide(SpinnerType.BallScaleMultiple);
          this.alertify.Notify("An unexpected error has occurred. Please refresh the page and try again.", {
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
