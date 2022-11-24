import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { GlobalRes } from 'src/app/contracts/globalRes';
import { Create_User } from 'src/app/contracts/users/create_user';
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

    const response = lastValueFrom(this.httpClientService.post<User | GlobalRes>({
      controller: "users",
      action: "loginUser"
    }, user));

    response.then((r: GlobalRes) => {
      if (r.succeeded)
        successCallBack?.();
      else
        errorCallBack?.(r.errorMessage);
    }).catch((err: HttpErrorResponse) => {
      errorCallBack?.(err.message);
    })

    await response;

  }

}
