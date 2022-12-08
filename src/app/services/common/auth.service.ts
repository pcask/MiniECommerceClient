import { SocialAuthService, SocialUser } from '@abacritt/angularx-social-login';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private jwtHelper: JwtHelperService, private socialAuthService: SocialAuthService, private router: Router) { }

  get isAuthenticated(): boolean {
    return _isAuthenticated;
  }

  get currentUser(): SocialUser {
    return _currentUser;
  }
  set currentUser(value: SocialUser) {
    _currentUser = value;
  }

  identityCheck() {
    const token: string = localStorage.getItem("accessToken");

    let expired: boolean = true;

    try {
      expired = this.jwtHelper.isTokenExpired(token);
    } catch (error) {
      expired = true;
    }

    _isAuthenticated = token !== null && !expired;
  }

  signOut() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    this.identityCheck();
    this.socialAuthService.signOut();
  }

  get canRefreshTokens(): boolean {

    try {

      this.identityCheck();

      const aToken = localStorage.getItem("accessToken");
      const rToken = localStorage.getItem("refreshToken");

      if (!rToken || rToken == undefined || rToken == "undefined" || rToken == "" ||
        !aToken || aToken == undefined || aToken == "undefined" || aToken == "")
        return false;


      const rTokenEndDate: Date = new Date(rToken.substring(44));
      const utcNow = new Date(new Date().toISOString().replace('Z',''));

      return !this.isAuthenticated && rTokenEndDate > utcNow

    } catch (error) {
      return false;
    }

  }

}

export let _isAuthenticated: boolean;
export let _currentUser: SocialUser;