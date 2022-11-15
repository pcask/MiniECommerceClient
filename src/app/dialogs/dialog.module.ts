import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { SelectProductImagesDialogComponent } from './select-product-images-dialog/select-product-images-dialog.component';
import { FileUploadModule } from '../services/common/file-upload/file-upload.module';



@NgModule({
  declarations: [
    DeleteDialogComponent,
    SelectProductImagesDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    FileUploadModule
  ]
})
export class DialogModule { }
