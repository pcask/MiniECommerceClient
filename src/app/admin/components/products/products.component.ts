import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { BaseComponent, SpinnerType } from 'src/app/base/base.component';
import { Product } from 'src/app/contracts/product';
import { HttpClientService } from 'src/app/services/common/http-client.service';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent extends BaseComponent implements OnInit {

  constructor(spinner: NgxSpinnerService, private httpClientService: HttpClientService) {
    super(spinner);
  }

  ngOnInit(): void {
    this.showSpinner(SpinnerType.BallSpinClockwise);

    // this.httpClientService.post({
    //   controller: "products"
    // }, {
    //   Name: "Laptop",
    //   AmountOfStock: 20,
    //   Price: 14000
    // }).subscribe();

    // this.httpClientService.post({
    //   controller: "products"
    // }, {
    //   Name: "Mouse",
    //   AmountOfStock: 120,
    //   Price: 600,
    // }).subscribe();

    // this.httpClientService.post({
    //   controller: "products"
    // }, {
    //   Name: "Keyboard",
    //   AmountOfStock: 80,
    //   Price: 950
    // }).subscribe();

    // this.httpClientService.put({
    //   controller: "products"
    // }, {
    //   Id: "60845e8a-a7bd-4cf6-802b-bf30ff95b34d",
    //   Name: "Keyboard",
    //   AmountOfStock: 90,
    //   Price: 949.99
    // }).subscribe();

    // this.httpClientService.delete({
    //   controller: "products"
    // }, "60845e8a-a7bd-4cf6-802b-bf30ff95b34d")
    //   .subscribe();

    this.httpClientService.get<Product[]>({
      controller: "products"
    }).subscribe(data => console.log(data[0].name));
  }

}
