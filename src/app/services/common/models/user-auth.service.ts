import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Login_User } from 'src/app/contracts/users/login_user';
import { User } from 'src/app/entities/user';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService: HttpClientService) { }

  async login(user: User, successCallBack?: () => void, errorCallBack?: (errMessage: string) => void) {

    const response = lastValueFrom(this.httpClientService.post<User | Login_User>({
      controller: "auths",
      action: "login"
    }, user));

    response.then((r: Login_User) => {
      if (r.token)
      {
        localStorage.setItem("accessToken", r.token.accessToken);
        successCallBack?.();
      }
    }).catch((err: HttpErrorResponse) => {
      errorCallBack?.("Your email and/or password is incorrect.");
    })

    await response;
  }

  async loginWithGoogle(user: SocialUser, successCallBack?: () => void, errorCallBack?: (errMessage: string) => void) {

    const response = lastValueFrom(this.httpClientService.post<SocialUser | Login_User>({
      controller: "auths",
      action: "login-with-google"
    }, user));

    response.then((r: Login_User) => {
      if (r.token)
      {
        localStorage.setItem("accessToken", r.token.accessToken);
        successCallBack?.();
      }
    }).catch((err: HttpErrorResponse) => {
      errorCallBack?.(err.message);
    })

    await response;
  }

  async loginWithFacebook(user: SocialUser, successCallBack?: () => void, errorCallBack?: (errMessage: string) => void) {

    const response = lastValueFrom(this.httpClientService.post<SocialUser | Login_User>({
      controller: "auths",
      action: "login-with-facebook"
    }, user));

    response.then((r: Login_User) => {
      if (r.token)
      {
        localStorage.setItem("accessToken", r.token.accessToken);
        successCallBack?.();
      }
    }).catch((err: HttpErrorResponse) => {
      errorCallBack?.(err.message);
    })

    await response;
  }
}
