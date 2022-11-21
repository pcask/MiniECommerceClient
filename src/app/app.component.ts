import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CustomToastrService, ToastrMessageType, ToastrOptions, ToastrPosition } from './services/ui/custom-toastr.service';

declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'eCommerceClient';
  constructor(private toastr: CustomToastrService) {

    // toastr.Notify("Meraba cnım", "Heyyo", new ToastrOptions());

    // toastr.Notify("Meraba cnım", "Heyyo",
    //   {
    //     messageType: ToastrMessageType.Success,
    //     position: ToastrPosition.TopFullWidth,
    //     timeOut: 3000
    //   });
  }
}

$(window).scroll(function (event) {
  var scroll = $(window).scrollTop();
  if(scroll < 90){
    $("#header-middle").removeClass("shadow-sm");
  }
  else
  {
    $("#header-middle").addClass("shadow-sm");
  }
});

