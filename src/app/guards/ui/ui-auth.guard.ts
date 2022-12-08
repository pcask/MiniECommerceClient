import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SpinnerType } from 'src/app/base/base.component';
import { AuthService, _isAuthenticated } from 'src/app/services/common/auth.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Injectable({
  providedIn: 'root'
})
export class UiAuthGuard implements CanActivate {

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

    if (!this.authService.isAuthenticated && this.authService.currentUser) {
      if (this.authService.canRefreshTokens) {

        const aToken = localStorage.getItem("accessToken");
        const rToken = localStorage.getItem("refreshToken");

        let result: boolean = await this.userAuthService.loginWithRefreshToken(aToken, rToken);
        if (result)
        {
          this.spinnerService.hide(SpinnerType.BallScaleMultiple);
          return true;
        }
        else
          this.authService.signOut();
      }
      else
        this.authService.signOut();
    }

    this.spinnerService.hide(SpinnerType.BallScaleMultiple);

    return true;

  }

}
