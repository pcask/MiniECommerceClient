import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { MatButtonModule } from '@angular/material/button';
import { SelectProductImagesDialogComponent } from './select-product-images-dialog/select-product-images-dialog.component';
import { FileUploadModule } from '../services/common/file-upload/file-upload.module';
import {MatCardModule} from '@angular/material/card';
import { UpdateDialogComponent } from './update-dialog/update-dialog.component';
import {MatRadioModule} from '@angular/material/radio';


@NgModule({
  declarations: [
    DeleteDialogComponent,
    SelectProductImagesDialogComponent,
    UpdateDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule, MatButtonModule, MatCardModule,
    FileUploadModule,
    MatRadioModule
  ]
})
export class DialogModule { }
