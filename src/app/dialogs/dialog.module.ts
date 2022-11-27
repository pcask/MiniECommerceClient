import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatLegacyDialogModule as MatDialogModule } from '@angular/material/legacy-dialog';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { MatLegacyButtonModule as MatButtonModule } from '@angular/material/legacy-button';
import { SelectProductImagesDialogComponent } from './select-product-images-dialog/select-product-images-dialog.component';
import { FileUploadModule } from '../services/common/file-upload/file-upload.module';
import {MatLegacyCardModule as MatCardModule} from '@angular/material/legacy-card';
import { UpdateDialogComponent } from './update-dialog/update-dialog.component';


@NgModule({
  declarations: [
    DeleteDialogComponent,
    SelectProductImagesDialogComponent,
    UpdateDialogComponent
  ],
  imports: [
    CommonModule,
    MatDialogModule, MatButtonModule, MatCardModule,
    FileUploadModule
  ]
})
export class DialogModule { }
