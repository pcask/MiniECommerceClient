import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { HubUrls } from 'src/app/constants/hub-urls';
import { ReceiveFunctions } from 'src/app/constants/receive-functions';
import { AlertifyMessageType, AlertifyPosition, AlertifyService } from 'src/app/services/admin/alertify.service';
import { SignalRService } from 'src/app/services/common/signalR.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService,
    private alertifyService: AlertifyService,
    private signalRService: SignalRService) {
    super(spinner);
    this.signalRService.start(HubUrls.ProductHub);
  }

  ngOnInit(): void {
    this.signalRService.on(ReceiveFunctions.ProductAddedMessage, message => {

      this.alertifyService.Notify(message, {
        messageType: AlertifyMessageType.Success,
        position: AlertifyPosition.TopCenter,
        delay: 2,
        dismissOther: true
      });

    });
  }

}
