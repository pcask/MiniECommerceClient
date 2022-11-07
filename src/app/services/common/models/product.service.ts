import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, from, lastValueFrom, Observable } from 'rxjs';
import { Create_Product } from 'src/app/contracts/create_product';
import { List_Product } from 'src/app/contracts/list_product';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private httpClientService: HttpClientService) { }

  create(createProduct: Create_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    this.httpClientService.post({
      controller: "products"
    }, createProduct).subscribe({
      complete() {
        successCallBack?.();
      },
      error(errorResponse: HttpErrorResponse) {
        const _error: Array<{ key: string, value: Array<string> }> = errorResponse.error;
        let message = "";
        _error.forEach((v, _index) => {
          v.value.forEach((_v, _index) => {
            message += `${_v}<br>`;
          });
        });
        errorCallBack?.(message);
      }
    });
  }

  async read(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<{ totalCount: number; products: List_Product[] }> {

    const allProduct: Promise<{ totalCount: number; products: List_Product[] }> = lastValueFrom(this.httpClientService.get<{ totalCount: number; products: List_Product[] }>({
      controller: "products",
      queryString: `page=${page}&size=${size}`
    }));

    allProduct.then(r => successCallBack?.())
      .catch((err: HttpErrorResponse) => errorCallBack?.(err.message));

    return await allProduct;

  }
}
