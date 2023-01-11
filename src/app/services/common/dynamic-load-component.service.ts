import { ComponentFactoryResolver, Injectable, ViewContainerRef } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DynamicLoadComponentService {

  constructor() { }

  async loadComponent(component: ComponentType, viewContainerRef: ViewContainerRef) {

    let _component: any = null;

    switch (component) {
      case ComponentType.MiniCartComponent:
        _component = (await import("../../ui/components/carts/mini-cart/mini-cart.component")).MiniCartComponent;
        break;
    }

    viewContainerRef.clear();
    return viewContainerRef.createComponent(_component);
  }

}

export enum ComponentType {
  MiniCartComponent
}