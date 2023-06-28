import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ConfigService } from 'projects/tools/src/lib/config.service';

export interface IRequestOptions {
  headers?: HttpHeaders;
  observe?: 'body';
  params?: HttpParams | { [param: string]: string | string[]; };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
  body?: any;
}

export interface IRawRequestOptions {
  body?: any;
  headers?: HttpHeaders ;
  reportProgress?: boolean;
  observe: 'response';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  responseType?: 'json';
  withCredentials?: boolean;
}

export interface IUploadRequestOptions {
  body?: any;
  headers?: HttpHeaders ;
  reportProgress?: boolean;
  observe: 'events';
  params?: HttpParams | {
    [param: string]: string | string[];
  };
  responseType?: 'json';
  withCredentials?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiClient {
  private api_url: string = '';
  private conf: any;

  // access_token: string = null;
  public locale: string = 'it-IT';

  public constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    this.conf = this.configService;

    this.conf.getConfig('app').subscribe(
      (result: any) => { this.api_url = (result.AppConfig.GOVAPI.HOST + result.AppConfig.GOVAPI.VERSION); }, 
      (err: any) => console.error(err));
  }

  /**
   * GET request
   * @param {string} endPoint it doesn't need / in front of the end point
   * @param {IRequestOptions} options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public get<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
  
    if (!options) options = {};
    
    return this.http.get<T>(this.api_url + endPoint, options);
  }

  /**
   * GET request and return the HttpResponse instance
   * @param {string} endPoint it doesn't need / in front of the end point
   * @param {IRequestOptions} options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public getRaw<T>(endPoint: string, options?: IRawRequestOptions): Observable<HttpResponse<T>> {
    if (!options) options = {observe: 'response'};

    return this.http.get<T>(this.api_url + endPoint, options);
  }

  /**
   * POST request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public post<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    if (!options) options = {};

    return this.http.post<T>(this.api_url + endPoint, params, options);
  }

  public postRaw<T>(endPoint: string, params: any, options?: IRawRequestOptions): Observable<HttpResponse<T>> {
    if (!options) options = {observe: 'response'};
    return this.http.post<T>(this.api_url + endPoint, params, options);
  }

  public postUpload<T>(endPoint: string, params: any, options?: IUploadRequestOptions): Observable<HttpEvent<T>> {
    if (!options) options = {observe: 'events'};
    return this.http.post<T>(this.api_url + endPoint, params, options);
  }

  /**
   * PATCH request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public patch<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    if (!options) options = {};
    return this.http.patch<T>(this.api_url + endPoint, params, options);
  }

  /**
   * PUT request
   * @param {string} endPoint end point of the api
   * @param {Object} params body of the request.
   * @param {IRequestOptions} options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public put<T>(endPoint: string, params: Object, options?: IRequestOptions): Observable<T> {
    if (!options) options = {};
    return this.http.put<T>(this.api_url + endPoint, params, options);
  }

  public putRaw<T>(endPoint: string, params: Object, options?: IRawRequestOptions): Observable<T> {
    if (!options) options = {observe: 'response'};
    return this.http.put<T>(this.api_url + endPoint, options);
  }

  /**
   * DELETE request
   * @param {string} endPoint end point of the api
   * @param {IRequestOptions} options of the request like headers, body, etc.
   * @returns {Observable<T>}
   */
  public delete<T>(endPoint: string, options?: IRequestOptions): Observable<T> {
    if (!options) options = {};
    return this.http.delete<T>(this.api_url + endPoint, options);
  }
}
