import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { User_Register } from 'src/app/entities/User_Register';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }

  signUpForm: FormGroup;

  ngOnInit(): void {

    this.signUpForm = this.formBuilder.group({
      email: ["", [
        Validators.required,
        Validators.email]],
      password: ["", [
        Validators.required,
        Validators.minLength(6)
      ]],
      rePassword: [""],
      termOfUse: ["", [
        Validators.requiredTrue
      ]]
    }, {
      validators: (group: AbstractControl): ValidationErrors | void => {
        if (!this.submitted)
          return;

        let pass = group.get("password").value;
        let rePass = group.get("rePassword").value;

        if (pass !== rePass)
          this.Controls['rePassword'].setErrors({ notSame: true });
      }
    });

  }

  get Controls() {
    return this.signUpForm.controls
  }

  submitted: boolean;
  onSubmit(data: User_Register) {
    this.submitted = true;
    if (this.signUpForm.invalid)
      return;

    //todo kullanıcı kayıt işlemi gerçekleştirilecek.
  }

  changeTab() {
    var signIn = $('#signInPane');
    var signUp = $('#signUpPane');
    var signInTab = $('#signInTab');
    var signUpTab = $('#signUpTab');

    if (signUp.hasClass('active')) {
      signInTab.addClass('active');
      signIn.addClass('active');
      signIn.addClass('show');

      
      signUpTab.removeClass('active');
      signUp.removeClass('active');
      signUp.removeClass('show');
    }
    else {
      signUpTab.addClass('active');
      signUp.addClass('active');
      signUp.addClass('show');

      signInTab.removeClass('active');
      signIn.removeClass('active');
      signIn.removeClass('show');
    }
  }

}
