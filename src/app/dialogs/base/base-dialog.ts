import { MatLegacyDialogRef as MatDialogRef } from "@angular/material/legacy-dialog";

export class BaseDialog<DialogComponent> {

    constructor(public dialogRef: MatDialogRef<DialogComponent>) {

    }

    close(): void {
        this.dialogRef.close();
    }
}

export enum DialogResults{
    Yes="yes",
    No ="no",
    Cancel ="cancel"
}
