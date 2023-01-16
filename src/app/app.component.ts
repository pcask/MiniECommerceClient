import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './services/common/auth.service';

declare var $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(
    public authService: AuthService,
    private router: Router
  ) {

    authService.identityCheck();
  }

  async ngOnInit() {

  }

  signOut() {
    this.authService.signOut();
    this.router.navigate([""]);
  }

  showMiniCart() {
    $(".my-cart-dropdown-content").addClass("active");
  }

  hideMiniCart(){
    $(".my-cart-dropdown-content").removeClass("active");
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

