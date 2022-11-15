import { Component, Inject, OnInit, Output } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FileUploadOptions } from 'src/app/services/common/file-upload/file-upload.component';
import { BaseDialog, DialogResults } from '../base/base-dialog';

@Component({
  selector: 'app-select-product-images-dialog',
  templateUrl: './select-product-images-dialog.component.html',
  styleUrls: ['./select-product-images-dialog.component.scss']
})
export class SelectProductImagesDialogComponent extends BaseDialog<SelectProductImagesDialogComponent> {

  constructor(
    dialogRef: MatDialogRef<SelectProductImagesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogResults | string) {
    super(dialogRef);
  }

  @Output() options: Partial<FileUploadOptions> = {
    accept: ".png, .jpg, .jpeg, .gif",
    controller: "products",
    action: "upload",
    explanation: "Ürün görsellerini buraya sürükleyin veya seçin. -->",
    isAdminPage: true,
    queryString: `id=${this.data}`,
  };

}
