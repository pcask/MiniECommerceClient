import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable } from 'rxjs';
import { SpinnerType } from 'src/app/base/base.component';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthGuard implements CanActivate {

  constructor(
    private router: Router,
    private toastrService: CustomToastrService,
    private spinnerService: NgxSpinnerService,
    private authService: AuthService,
    private userAuthService: UserAuthService) {

  }
  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    this.spinnerService.show(SpinnerType.BallScaleMultiple);

    this.authService.identityCheck();

    if (!this.authService.isAuthenticated) {
      if (this.authService.canRefreshTokens) {

        const aToken = localStorage.getItem("accessToken");
        const rToken = localStorage.getItem("refreshToken");

        let result: boolean = await this.userAuthService.loginWithRefreshToken(aToken, rToken);
        if (result){
          this.spinnerService.hide(SpinnerType.BallScaleMultiple);
          return true;
        }
        else {
          this.redirectLogin(state);
        }
      }
      else {
        this.redirectLogin(state);
      }

    }

    this.spinnerService.hide(SpinnerType.BallScaleMultiple);

    return true;

  }

  redirectLogin(state: RouterStateSnapshot) {

    this.spinnerService.hide(SpinnerType.BallScaleMultiple);

    if (this.authService.currentUser)
      this.authService.signOut();

    this.router.navigate(["login"], { queryParams: { returnUrl: state.url } });

    this.toastrService.Notify("You must be logged in to access the relevant page", "Sory", {
      messageType: ToastrMessageType.Warning,
      position: ToastrPosition.TopCenter,
      timeOut: 2500
    });

  }

}

