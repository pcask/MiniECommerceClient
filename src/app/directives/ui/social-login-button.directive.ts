import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { take } from 'rxjs';

declare var google;

@Directive({
  selector: 'social-login-button'
})
export class SocialLoginButtonDirective implements OnInit {

  @Input('selectable') option: boolean;

  constructor(private el: ElementRef, private socialAuthService: SocialAuthService) { }

  ngOnInit(): void {
    if (!this.option) return;
    this.socialAuthService.initState.pipe(take(1)).subscribe(() => {
      google.accounts.id.renderButton(this.el.nativeElement, {
        type: 'standard',
        size: 'large',
        text: 'signin_with',
        theme: 'filled_blue',
      });
    });
  }

}
