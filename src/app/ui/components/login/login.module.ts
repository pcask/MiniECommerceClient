import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SocialLoginButtonDirective } from 'src/app/directives/ui/social-login-button.directive';



@NgModule({
  declarations: [
    LoginComponent,
    SocialLoginButtonDirective
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([{
      path: "", component: LoginComponent
    }]),
    ReactiveFormsModule
  ]
})
export class LoginModule { }
