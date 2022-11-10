import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { NgxFileDropEntry } from 'ngx-file-drop';
import { AlertifyService, AlertifyMessageType, AlertifyPosition } from '../../admin/alertify.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from '../../ui/custom-toastr.service';
import { HttpClientService } from '../http-client.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrls: ['./file-upload.component.scss']
})
export class FileUploadComponent {

  constructor(private httpClientService: HttpClientService, private alertify: AlertifyService, private toastr: CustomToastrService) {

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

    this.httpClientService.post({
      controller: this.options.controller,
      action: this.options.action,
      headers: new HttpHeaders({ "responseType": "blob" })
    }, formData).subscribe({
      complete: () => {

        const succesMessage: string = "Dosya yükleme işlemi başarılı.";
        
        if (this.options.isAdminPage) {
          this.alertify.Notify(succesMessage, {
            dismissOther: true,
            messageType: AlertifyMessageType.Success,
            position: AlertifyPosition.TopRight,
            delay: 2
          });
        }
        else {
          this.toastr.Notify(succesMessage, "Tebrikler", {
            messageType: ToastrMessageType.Success,
            timeOut: 2000,
            position: ToastrPosition.TopRight
          })
        }
      },
      error: (errorResponse: HttpErrorResponse) => {
        const errorMessage: string = "Dosya yükleme işlemi başarısız! Lütfen sayfayı yenileyip tekrar deneyiniz."
        
        if (this.options.isAdminPage) {
          this.alertify.Notify(errorMessage, {
            messageType: AlertifyMessageType.Error,
            position:AlertifyPosition.TopRight
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

  public fileOver(event) {
    console.log(event);
  }

  public fileLeave(event) {
    console.log(event);
  }

}

export class FileUploadOptions {
  controller?: string;
  action?: string;
  queryString?: string;
  explanation?: string;
  accept?: string;
  isAdminPage?: boolean = false;
}
