import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { User } from 'src/app/entities/user';
import { UserService } from 'src/app/services/common/models/user.service';
import { CustomToastrService, ToastrMessageType, ToastrPosition } from 'src/app/services/ui/custom-toastr.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent extends BaseComponent implements OnInit {
  submitted: boolean = false;
  errorMessage: string = null;
  loginForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService: UserService, private toastrService: CustomToastrService, spinner: NgxSpinnerService) {
    super(spinner);
  }

  get Controls() {
    return this.loginForm.controls
  }

  ngOnInit(): void {

    this.loginForm = this.formBuilder.group({
      email: ["", [Validators.required, Validators.email]],
      password: ["", [Validators.required]]
    });

  }

  async onSubmit(user: User) {

    this.submitted = true;

    if (this.loginForm.invalid)
      return;

    this.showSpinner(SpinnerType.BallScaleMultiple);

    await this.userService.login(user, () => {
      this.hideSpinner(SpinnerType.BallScaleMultiple);
      this.toastrService.Notify("", "Hoşgeldin", {
        messageType: ToastrMessageType.Info,
        position: ToastrPosition.TopCenter,
        timeOut: 1500
      });
    }, (errMessage: string) => {
      this.hideSpinner(SpinnerType.BallScaleMultiple);
      debugger;
      this.loginForm.setErrors({ general: true });
      this.errorMessage = errMessage;
    });

  }

}
