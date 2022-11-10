import { HttpErrorResponse } from '@angular/common/http';
import { Directive, ElementRef, EventEmitter, HostListener, Input, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent, DialogOptions } from 'src/app/dialogs/delete-dialog/delete-dialog.component';
import { AlertifyService, AlertifyMessageType, AlertifyPosition } from 'src/app/services/admin/alertify.service';
import { HttpClientService } from 'src/app/services/common/http-client.service';

declare var $: any;

@Directive({
  selector: '[appDelete]'
})
export class DeleteDirective {

  constructor(private element: ElementRef
    , private _renderer: Renderer2
    , private httpClientService: HttpClientService
    , private alertify: AlertifyService
    , public dialog: MatDialog) {

    const img = _renderer.createElement("img");
    img.setAttribute("src", "/assets/icons/delete.png");
    img.setAttribute("title", "delete");
    img.setAttribute("style", "cursor: pointer;");
    img.width = 25;
    img.height = 25;
    _renderer.appendChild(element.nativeElement, img);

  }

  @Output() deleteProductEvent: EventEmitter<any> = new EventEmitter();

  @Input() id: string;
  @Input() controller: string;

  @HostListener("click")
  onclick() {
    const td: HTMLTableCellElement = this.element.nativeElement;

    this.openDialog(() => {
      this.httpClientService.delete({
        controller: this.controller
      }, this.id).subscribe({
        complete: () => {
          $(td.parentElement).fadeOut(400);

          setTimeout(() => {
            this.alertify.Notify("Ürün silme işlemi başarılı.", {
              dismissOther: true,
              messageType: AlertifyMessageType.Success,
              position: AlertifyPosition.TopRight,
              delay: 2
            });
            this.deleteProductEvent.emit();
          }, 400);

        }, error: (errorResponse: HttpErrorResponse) => {
          this.alertify.Notify(errorResponse.message, {
            dismissOther: true,
            messageType: AlertifyMessageType.Error,
            position: AlertifyPosition.TopRight,
            delay: 2
          });
        }
      });
    })


  }

  openDialog(deleteCallBack: () => void): void {
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '400px',
      data: DialogOptions.Yes
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == DialogOptions.Yes) {
        deleteCallBack();
      }
    });
  }
}
