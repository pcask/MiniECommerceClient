import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/common/auth.service';

declare var $: any

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(public authService: AuthService, private router: Router) {

    authService.identityCheck();

  }

  signOut() {
    localStorage.removeItem("accessToken");
    this.authService.identityCheck();
    this.router.navigate([""]);
  }
}

$(window).scroll(function (event) {
  var scroll = $(window).scrollTop();
  if (scroll < 90) {
    $("#header-middle").removeClass("shadow-sm");
  }
  else {
    $("#header-middle").addClass("shadow-sm");
  }
});

