import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';


// Built-in *ngIf directive'inde number bir değer 0 dönmesi durumunda varsayılan değer olarak gördüğü için veri gelmemiş kabul ediyor ve içeriği yayınlamıyordu.
// Bu durumun önüne geçmek için custom bir directive oluşturarak kendi kurallarımızı koyabiliyoruz.
// Geri dönüş değeri olarak istediğimiz sayıda, istediğimiz değere dönebiliyoruz. (şuan için count adı altında value'nun değerini döndürmek yeterli olacaktır. )
@Directive({
  selector: '[appCustomNgIf]'
})
export class CustomNgIfDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef) { }

  @Input() set appCustomNgIf(value: number) {

    if (value > -1) {
      this.viewContainer.clear();
      this.viewContainer.createEmbeddedView(this.templateRef, { count: value });
    }
    else {
      this.viewContainer.clear();
    }

  }
}
