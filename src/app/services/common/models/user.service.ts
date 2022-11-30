import { SocialUser } from '@abacritt/angularx-social-login';
import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { Create_User } from 'src/app/contracts/users/create_user';
import { Login_User } from 'src/app/contracts/users/login_user';
import { User } from 'src/app/entities/user';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private httpClientService: HttpClientService) { }

  async create(user: User, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<Create_User> {

    const response = lastValueFrom(this.httpClientService.post<User | Create_User>({
      controller: "users"
    }, user))

    response
      .then((data: Create_User) => {
        if (data.succeeded)
          successCallBack?.();
        else
          errorCallBack?.(data.errorMessage);
      })
      .catch((err: HttpErrorResponse) => errorCallBack?.(err.message))

    return await response as Create_User;

  }

  async login(user: User, successCallBack?: () => void, errorCallBack?: (errMessage: string) => void) {

    const response = lastValueFrom(this.httpClientService.post<User | Login_User>({
      controller: "users",
      action: "loginUser"
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
      controller: "users",
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

}
