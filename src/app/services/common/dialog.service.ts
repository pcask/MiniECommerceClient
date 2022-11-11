import { ComponentType } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { DialogPosition, MatDialog } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

  constructor(private dialog: MatDialog) { }

  openDialog(dialogParameters: Partial<DialogParameters>): void {
    const dialogRef = this.dialog.open(dialogParameters.componentType, {
      width: dialogParameters.options?.width,
      height: dialogParameters.options?.height,
      position: dialogParameters.options?.position,
      data: dialogParameters.data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result == dialogParameters.data) {
        dialogParameters.afterClosedCallBack();
      }
    });
  }

}

export class DialogParameters {
  componentType: ComponentType<any>;
  afterClosedCallBack: () => void;
  data: any;
  options?: Partial<DialogOptions>;
}

export class DialogOptions {
  width?: string;
  height?: string;
  position?: DialogPosition;
}
