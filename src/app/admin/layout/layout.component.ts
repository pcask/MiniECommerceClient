import { Component, OnInit } from '@angular/core';
import { AlertifyOptions, AlertifyService} from 'src/app/services/admin/alertify.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  constructor(private alertify: AlertifyService) { }

  ngOnInit(): void {
    // this.alertify.Notify("Denemeee", new AlertifyOptions())
  }

}
