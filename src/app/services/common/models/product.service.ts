import { HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, lastValueFrom, Observable, of, tap } from 'rxjs';
import { Create_Product } from 'src/app/contracts/products/create_product';
import { List_Product } from 'src/app/contracts/products/list_product';
import { List_Product_Image } from 'src/app/contracts/products/list_product_Image';
import { Update_Product } from 'src/app/contracts/products/update_product';
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

  async update(updateProduct: Update_Product, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const update$ = this.httpClientService.put({
      controller: "products"
    }, updateProduct);

    await lastValueFrom(update$)
      .then(r => successCallBack?.())
      .catch((err: HttpErrorResponse) => errorCallBack(err.message))
  }

  async read(page: number = 0, size: number = 5, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void)
    : Promise<{ totalCount: number; products: List_Product[] }> {

    const allProducts = lastValueFrom(this.httpClientService.get<{ totalCount: number; products: List_Product[] }>({
      controller: "products",
      queryString: `page=${page}&size=${size}`
    }));

    allProducts.then(r => {
      successCallBack?.();
    }).catch((err: HttpErrorResponse) => {
      errorCallBack?.(err.message);
    })

    return await allProducts;
  }

  async delete(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const delete$: Observable<any> = this.httpClientService.delete<any>({
      controller: "products"
    }, id);

    await lastValueFrom(delete$)
      .then(r => successCallBack?.())
      .catch((err: HttpErrorResponse) => errorCallBack(err.message));
  }

  async getImagesByProductId(id: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void): Promise<List_Product_Image[]> {

    const allImages: Promise<List_Product_Image[]> = lastValueFrom(this.httpClientService.get<List_Product_Image[]>({
      controller: "products",
      action: "getImages"
    }, id));

    allImages
      .then(r => successCallBack?.())
      .catch((err: HttpErrorResponse) => errorCallBack?.(err.message));

    return await allImages;

  }

  async deleteImage(id: string, imageId: string, successCallBack?: () => void, errorCallBack?: (errorMessage: string) => void) {
    const delete$ = this.httpClientService.delete({
      controller: "products",
      action: "deleteImage",
      queryString: `imageId=${imageId}`
    }, id);

    await lastValueFrom(delete$)
      .then(r => successCallBack?.())
      .catch((err: HttpErrorResponse) => errorCallBack(err.message));
  }
}
