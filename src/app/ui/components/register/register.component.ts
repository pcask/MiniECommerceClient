import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { User } from 'src/app/entities/user';
import { AuthService } from 'src/app/services/common/auth.service';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent extends BaseComponent implements OnInit {
  submitted: boolean = false;
  registerForm: FormGroup;

  constructor(private formBuilder: FormBuilder,
    private userService: UserService,
    private toastrService: CustomToastrService,
    spinner: NgxSpinnerService,
    private router: Router,
    private authService: AuthService) {
    super(spinner)
  }

  ngOnInit(): void {

    if (this.authService.isAuthenticated)
      this.router.navigate([""]);

    this.registerForm = this.formBuilder.group({
      email: ["", [
        Validators.required,
        Validators.email]],
      password: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          RegisterCustomValidators.patternValidator(new RegExp("(?=.*[0-9])"), {
            requiresDigit: true
          }),
          RegisterCustomValidators.patternValidator(new RegExp("(?=.*[A-Z])"), {
            requiresUppercase: true
          }),
          RegisterCustomValidators.patternValidator(new RegExp("(?=.*[a-z])"), {
            requiresLowercase: true
          })
        ])
      ),
      rePassword: ["", [
        Validators.required,
        Validators.minLength(6)]],
      termOfUse: ["", [
        Validators.requiredTrue
      ]]
    }, { validators: RegisterCustomValidators.MatchValidator });

  }

  get Controls() {
    return this.registerForm.controls
  }

  get passwordValid() {
    return this.Controls["password"].errors === null;
  }

  get requiredValid() {
    return !this.Controls["password"].hasError("required");
  }
  get minLengthValid() {
    return !this.Controls["password"].hasError("minlength");
  }
  get requiresDigitValid() {
    return !this.Controls["password"].hasError("requiresDigit");
  }
  get requiresUppercaseValid() {
    return !this.Controls["password"].hasError("requiresUppercase");
  }
  get requiresLowercaseValid() {
    return !this.Controls["password"].hasError("requiresLowercase");
  }



  async onSubmit(user: User) {
    this.submitted = true;
    if (this.registerForm.invalid)
      return;

    this.showSpinner(SpinnerType.BallScaleMultiple);
    await this.userService.create(user, () => {
      this.hideSpinner(SpinnerType.BallScaleMultiple);
      this.router.navigate(["login"]);
      this.toastrService.Notify("Welcome to the club :)", "Congrats", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
        timeOut: 2000
      })
    }, (errorMessage: string) => {
      this.hideSpinner(SpinnerType.BallScaleMultiple);
      this.toastrService.Notify(errorMessage, "Upsss", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
        timeOut: 3000
      })
    })
  }

}

export class RegisterCustomValidators {
  static MatchValidator(control: AbstractControl) {
    const password: string = control.get("password").value; // get password from our password form control
    const rePassword: string = control.get("rePassword").value; // get password from our confirmPassword form control

    debugger;
    // if the confirmPassword value is null or empty, don't return an error.
    if (!rePassword?.length) {
      return null;
    }

    // if the confirmPassword length is < 6, set the minLength error.
    if (rePassword.length < 6) {
      control.get('rePassword').setErrors({ minlength: true });
    } else {
      // compare the passwords and see if they match.
      if (password !== rePassword) {
        control.get("rePassword").setErrors({ mismatch: true });
      } else {
        // if passwords match, don't return an error.
        control.get("rePassword").setErrors(null);
        return null;
      }
    }
  }

  static patternValidator(regex: RegExp, error: ValidationErrors): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        // if the control value is empty return no error.
        return null;
      }

      // test the value of the control against the regexp supplied.
      const valid = regex.test(control.value);

      // if true, return no error, otherwise return the error object passed in the second parameter.
      return valid ? null : error;
    };
  }

}
