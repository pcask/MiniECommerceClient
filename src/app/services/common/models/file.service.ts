import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { lastValueFrom } from 'rxjs';
import { BaseURL } from 'src/app/contracts/baseUrl';
import { HttpClientService } from '../http-client.service';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClientService: HttpClientService) { }

  async getStorageBaseUrl() {

    const result$ = this.httpClientService.get<BaseURL>({
      controller: "files",
      action: "getStorageBaseUrl"
    });

    return await lastValueFrom(result$);
  }
}
