import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { DialogResults } from 'src/app/dialogs/base/base-dialog';
import { FileUploadDialogComponent } from 'src/app/dialogs/file-upload-dialog/file-upload-dialog.component';
import { AlertifyService, AlertifyMessageType, AlertifyPosition } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { DialogService } from '../dialog.service';
import { HttpClientService } from '../http-client.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(
    private httpClientService: HttpClientService,
    private alertify: AlertifyService,
    private toastr: CustomToastrService,
    private dialogService: DialogService) {

  }

  @Input() options: Partial<FileUploadOptions>;

  public files: NgxFileDropEntry[];

  public dropped(files: NgxFileDropEntry[]) {
    this.files = files;
    const formData = new FormData()

    for (const droppedFile of files) {

      const fileEntry = droppedFile.fileEntry as FileSystemFileEntry;

      fileEntry.file((_file: File) => {
        formData.append(_file.name, _file, droppedFile.relativePath)
      });

    }

    this.dialogService.openDialog({
      componentType: FileUploadDialogComponent,
      data: [DialogResults.Yes],
      options: { width: "450px" },
      afterClosedCallBack: () => {

        this.httpClientService.post({
          controller: this.options.controller,
          action: this.options.action,
          queryString: this.options.queryString,
          headers: new HttpHeaders({ "responseType": "blob" })
        }, formData).subscribe({
          complete: () => {
            this.files = null;
            this.options.successCallBack?.();
            const succesMessage: string = "File upload successful.";

            if (this.options.isAdminPage) {
              this.alertify.Notify(succesMessage, {
                dismissOther: true,
                messageType: AlertifyMessageType.Success,
                position: AlertifyPosition.TopRight,
                delay: 2
              });
            }
            else {
              this.toastr.Notify(succesMessage, "Congratulations!", {
                messageType: ToastrMessageType.Success,
                timeOut: 2000,
                position: ToastrPosition.TopRight
              })
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            const errorMessage: string = "An unexpected error has occurred. Please refresh the page and try again."

            if (this.options.isAdminPage) {
              this.alertify.Notify(errorMessage, {
                messageType: AlertifyMessageType.Error,
                position: AlertifyPosition.TopRight
              });
            }
            else {
              this.toastr.Notify(errorMessage, "Upss!", {
                messageType: ToastrMessageType.Error,
                position: ToastrPosition.TopRight,
                timeOut: 2000
              })
            }
          }
        });

      }

    });
  }

  public fileOver(event) {
    // console.log(event);
  }

  public fileLeave(event) {
    // console.log(event);
  }

}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
  successCallBack?: () => Promise<void>;
}
