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

}
