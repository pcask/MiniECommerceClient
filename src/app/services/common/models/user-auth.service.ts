import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom, Observable, switchMap } from 'rxjs';
import { Tokens } from 'src/app/contracts/tokens';
import { User } from 'src/app/entities/user';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserAuthService {

  constructor(private httpClientService: HttpClientService) { }

  async login(user: User, successCallBack?: () => void, errorCallBack?: (errMessage: string) => void) {

    const response = lastValueFrom(this.httpClientService.post<User | Tokens>({
      controller: "auths",
      action: "login"
    }, user));

    response.then((r: Tokens) => {

      localStorage.setItem("accessToken", r.accessToken);
      localStorage.setItem("refreshToken", r.refreshToken);
      successCallBack?.();

    }).catch((err: HttpErrorResponse) => {
      errorCallBack?.("Your email and/or password is incorrect.");
    })

    await response;
  }

  async loginWithGoogle(user: SocialUser, successCallBack?: () => void, errorCallBack?: (errMessage: string) => void) {

    const response = lastValueFrom(this.httpClientService.post<SocialUser | Tokens>({
      controller: "auths",
      action: "login-with-google"
    }, user));

    response.then((r: Tokens) => {

      localStorage.setItem("accessToken", r.accessToken);
      localStorage.setItem("refreshToken", r.refreshToken);
      successCallBack?.();
    }).catch((err: HttpErrorResponse) => {
      errorCallBack?.(err.message);
    })

    await response;
  }

  async loginWithFacebook(user: SocialUser, successCallBack?: () => void, errorCallBack?: (errMessage: string) => void) {

    const response = lastValueFrom(this.httpClientService.post<SocialUser | Tokens>({
      controller: "auths",
      action: "login-with-facebook"
    }, user));

    response.then((r: Tokens) => {

      localStorage.setItem("accessToken", r.accessToken);
      localStorage.setItem("refreshToken", r.refreshToken);
      successCallBack?.();

    }).catch((err: HttpErrorResponse) => {
      errorCallBack?.(err.message);
    })

    await response;
  }

  async loginWithRefreshToken(aToken: string, rToken: string): Promise<boolean> {

    const tokens = await lastValueFrom(this.httpClientService.post<Tokens>({
      controller: "auths",
      action: "login-with-refresh-token"
    }, { accessToken: aToken, refreshToken: rToken }));

    if (tokens && tokens.accessToken && tokens.refreshToken) {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      return true;
    }
    else
      return false;

  }
  
}
