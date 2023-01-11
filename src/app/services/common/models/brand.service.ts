import { Injectable } from '@angular/core';
import { List_Brand } from 'src/app/contracts/brands/list_brand';
import { HttpClientService } from '../http-client.service';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BrandService {

  constructor(private httpClientService: HttpClientService) { }

  async read(successCallBack?: () => void): Promise<List_Brand[]> {

    const brands$ = this.httpClientService.get<List_Brand[]>({
      controller: "brands"
    });

    const brands = await lastValueFrom(brands$);
    successCallBack?.();

    return brands;
  }

  async getBrandByProductId(productId: string) {
    const brand$ = this.httpClientService.get<List_Brand>({
      controller: "brands",
      action: "GetBrandByProductId"
    }, productId);

    return await lastValueFrom(brand$);
  }
}
