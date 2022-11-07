import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Create_Product } from 'src/app/contracts/create_product';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService: HttpClientService) { }

  create(createProduct: Create_Product, successCallBack: () => void, errorCallBack: (errorMessage: string) => void) {
    this.httpClientService.post({
      controller: "products"
    }, createProduct).subscribe({
      complete() {
        successCallBack();
      },
      error(errorResponse: HttpErrorResponse) {
        const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
        let message = "";
        _error.forEach((v, index) => {
          v.value.forEach((_v, index) => {
            message += `${_v}<br>`;
          });
        });
        errorCallBack(message);
      }
    });
  }
}
