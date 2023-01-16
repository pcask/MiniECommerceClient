import { FacebookLoginProvider, SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { User } from 'src/app/entities/user';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserAuthService } from 'src/app/services/common/models/user-auth.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  submitted: boolean = false;
  errorMessage: string = null;
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private userAuthService: UserAuthService,
    private toastrService: CustomToastrService,
    spinner: NgxSpinnerService,
    private router: Router,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private socialAuthService: SocialAuthService
  ) {
    super(spinner);
  }

  get Controls() {
    return this.loginForm.controls
  }

  ngOnInit(): void {

    if (this.authService.isAuthenticated)
      this.router.navigate([""]);
    else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    }

    this.loginWithSocial();

    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });

  }

  async onSubmit(user: User) {

    this.submitted = true;

    if (this.loginForm.invalid)
      return;

    this.showSpinner(SpinnerType.BallScaleMultiple);

    await this.userAuthService.login(user, () => {
      this.authService.identityCheck();
      this.hideSpinner(SpinnerType.BallScaleMultiple);

      this.activatedRoute.queryParams.subscribe(params => {
        const url = params["returnUrl"]
        if (url)
          this.router.navigate([url]);
        else
          this.router.navigate([""]);
      });

      window.location.reload();

      this.toastrService.Notify("", "Welcome!", {
        messageType: ToastrMessageType.Info,
        position: ToastrPosition.TopCenter,
        timeOut: 1500,
      });
    }, (errMessage: string) => {
      this.loginForm.setErrors({ general: true });
      this.errorMessage = errMessage;
      this.hideSpinner(SpinnerType.BallScaleMultiple);
    });

  }

  loginWithSocial() {

    this.socialAuthService.authState.subscribe(async (user: SocialUser) => {

      this.authService.currentUser = user;
      if (!user)
        return;

      this.showSpinner(SpinnerType.BallScaleMultiple);

      switch (user.provider) {
        case "GOOGLE":
          this.loginWithGoogle(user);
          break;
        case "FACEBOOK":
          this.loginWithFacebook(user);
          break;
        default:
          break;
      }

      console.log(user);
    });
  }

  async loginWithGoogle(user: SocialUser) {

    await this.userAuthService.loginWithGoogle(user, () => {
      this.successCallback();
    }, (errMessage: string) => {
      this.errorCallback(errMessage);
    });
  }

  loginWithFacebook(user: SocialUser) {
    this.userAuthService.loginWithFacebook(user, () => {
      this.successCallback();
    }, (errMessage: string) => {
      this.errorCallback(errMessage);
    });
  }

  facebookBtnClick() {
    this.socialAuthService.signIn(FacebookLoginProvider.PROVIDER_ID)
  }

  successCallback() {
    this.authService.identityCheck();
    this.hideSpinner(SpinnerType.BallScaleMultiple);

    this.activatedRoute.queryParams.subscribe(params => {
      const url = params["returnUrl"]
      if (url)
        this.router.navigate([url]);
      else
        this.router.navigate([""]);
    });

    window.location.reload();
    
    this.toastrService.Notify("", "Welcome!", {
      messageType: ToastrMessageType.Info,
      position: ToastrPosition.TopCenter,
      timeOut: 1500
    });
  }

  errorCallback(message: string) {
    this.loginForm.setErrors({ general: true });
    this.errorMessage = message;
    this.hideSpinner(SpinnerType.BallScaleMultiple);
  }

}
