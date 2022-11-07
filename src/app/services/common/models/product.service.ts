import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Create_Product } from 'src/app/contracts/create_product';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService: HttpClientService) { }

  create(createProduct: Create_Product, successCallBack: any) {
    this.httpClientService.post({
      controller: "products"
    }, createProduct).subscribe(result => {
      successCallBack();
    });
  }
}
