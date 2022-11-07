import { Injectable } from '@angular/core';

declare var alertify: any

@Injectable({
  providedIn: 'root'
})

export class AlertifyService {

  constructor() { }

  Notify(message: string, options: Partial<AlertifyOptions>) {
    alertify.set('notifier', 'delay', options.delay);
    alertify.set('notifier', 'position', options.position);
    const msg = alertify[options.messageType ?? MessageType.Error](message);
    if (options.dismissOther)
      msg.dismissOthers();
  }

  DismissAll() {
    alertify.dismissAll();
  }
}

export enum MessageType {
  Error = "error",
  Message = "message",
  Notify = "notify",
  Success = "success",
  Warning = "warning"
}

export enum Position {
  TopCenter = "top-center",
  TopRight = "top-right",
  TopLeft = "top-left",
  BottomCenter = "bottom-center",
  BottomRight = "bottom-right",
  BottomLeft = "bottom-left"
}

export class AlertifyOptions {
  messageType: MessageType = MessageType.Success;
  position: Position = Position.BottomRight;
  delay: number = 2;
  dismissOther: boolean = true;
}