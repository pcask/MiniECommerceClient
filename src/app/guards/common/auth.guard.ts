import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { AuthService, _isAuthenticated } from 'src/app/services/common/auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private toastrService: CustomToastrService,
    private spinnerService: NgxSpinnerService,
    private authService: AuthService) {

  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    this.spinnerService.show(SpinnerType.BallScaleMultiple);

    this.authService.identityCheck();

    const arrayURL = state.url.split("/");

    if(this.authService.isAuthenticated && arrayURL.indexOf("login") > -1){
      this.router.navigate([""]);
    }

    if (!this.authService.isAuthenticated && arrayURL.indexOf("admin") > -1) {

      this.router.navigate(["login"], { queryParams: { returnUrl: state.url } });

      this.toastrService.Notify("You must be logged in to access the relevant page", "Sory", {
        messageType: ToastrMessageType.Warning,
        position: ToastrPosition.TopCenter,
        timeOut: 2500
      });
    }

    this.spinnerService.hide(SpinnerType.BallScaleMultiple);

    return true;

  }

}
