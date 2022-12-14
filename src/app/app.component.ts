import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ListCartItem } from './contracts/cart/list-cart-item';
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

  cartItems: ListCartItem[] = [];
  storageUrl: string;
  totalItemCount: number;

  async ngOnInit(): Promise<void> {
    
  }

  signOut() {
    this.authService.signOut();
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

