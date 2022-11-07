import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {

  constructor(private httpClient: HttpClient, @Inject("baseURL") private baseURL: string) { }

  generateURL(requestParameters: Partial<RequestParameters>): string {

    return `${requestParameters.baseURL ? requestParameters.baseURL : this.baseURL}/` +
      `${requestParameters.controller}` +
      `${requestParameters.action ? `/${requestParameters.action}` : ""}`;
  }


  get<T>(requestParameters: Partial<RequestParameters>, id?: string): Observable<T> {

    let url: string = "";

    if (requestParameters.fullEndPoint)
      url = requestParameters.fullEndPoint;
    else
      url = `${this.generateURL(requestParameters)}${id ? `/${id}` : ""}${requestParameters.queryString ? `?${requestParameters.queryString}`: ""}`;

    return this.httpClient.get<T>(url, { headers: requestParameters.headers });
  }

  post<T>(requestParameters: Partial<RequestParameters>, body: Partial<T>): Observable<T> {

    let url: string = "";

    if (requestParameters.fullEndPoint)
      url = requestParameters.fullEndPoint;
    else
      url = `${this.generateURL(requestParameters)}${requestParameters.queryString ? `?${requestParameters.queryString}`: ""}`;

    return this.httpClient.post<T>(url, body, { headers: requestParameters.headers });
  }

  put<T>(requestParameters: Partial<RequestParameters>, body: Partial<T>): Observable<T> {

    let url: string = "";

    if (requestParameters.fullEndPoint)
      url = requestParameters.fullEndPoint;
    else
      url = `${this.generateURL(requestParameters)}${requestParameters.queryString ? `?${requestParameters.queryString}`: ""}`;

    return this.httpClient.put<T>(url, body, { headers: requestParameters.headers });

  }

  delete<T>(requestParameters: Partial<RequestParameters>, id: string): Observable<T> {

    let url: string = "";

    if (requestParameters.fullEndPoint)
      url = requestParameters.fullEndPoint
    else
      url = `${this.generateURL(requestParameters)}/${id}${requestParameters.queryString ? `?${requestParameters.queryString}`: ""}`;

    return this.httpClient.delete<T>(url, { headers: requestParameters.headers });

  }
}

export class RequestParameters {
  controller?: string;
  action?: string;

  queryString?: string;
  headers?: HttpHeaders;
  baseURL?: string; // Olurda baseUrl'den farklı bir url'e istek atmak istersek
  fullEndPoint?: string; // Olurda tamamen farklı bir adrese istek atmak istersek
}