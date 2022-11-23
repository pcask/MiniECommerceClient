import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

declare var $: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  submitted: boolean = false;
  signUpForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastrService: CustomToastrService) { }

  ngOnInit(): void {

    this.signUpForm = this.formBuilder.group({
      email: ["", [
        Validators.required,
        Validators.email]],
      password: new FormControl(
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(6),
          CustomValidators.patternValidator(new RegExp("(?=.*[0-9])"), {
            requiresDigit: true
          }),
          CustomValidators.patternValidator(new RegExp("(?=.*[A-Z])"), {
            requiresUppercase: true
          }),
          CustomValidators.patternValidator(new RegExp("(?=.*[a-z])"), {
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
    }, { validators: CustomValidators.MatchValidator });

  }

  get Controls() {
    return this.signUpForm.controls
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
    if (this.signUpForm.invalid)
      return;

    await this.userService.create(user, () => {
      this.toastrService.Notify("Kayıt işleminiz başarıyla gerçekleştirildi.", "Tebrikler", {
        messageType: ToastrMessageType.Success,
        position: ToastrPosition.TopRight,
        timeOut: 2000
      })
    }, (errorMessage: string) => {
      this.toastrService.Notify(errorMessage, "Upsss", {
        messageType: ToastrMessageType.Error,
        position: ToastrPosition.TopRight,
        timeOut: 3000
      })
    })
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

export class CustomValidators {
  static MatchValidator(control: AbstractControl) {
    const password: string = control.get("password").value; // get password from our password form control
    const rePassword: string = control.get("rePassword").value; // get password from our confirmPassword form control


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
