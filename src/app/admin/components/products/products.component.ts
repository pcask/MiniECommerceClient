import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent } from 'src/app/base/base.component';
import { Update_Product } from 'src/app/contracts/products/update_product';
import { CreateComponent } from './create/create.component';
import { ListComponent } from './list/list.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService) {
    super(spinner);
  }

  @ViewChild(ListComponent) listComponent: ListComponent;
  @ViewChild(CreateComponent) createComponent: CreateComponent;

  ngOnInit(): void {

  }

  async reloadTable() {
    await this.listComponent.getProducts();
  }

  passUpdateFormData(product: Update_Product) {
    this.createComponent.loadUpdateForm(product);
  }

}
