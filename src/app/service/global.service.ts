import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable()
export class GlobalService {
    private documentList: string[] = [];
    private rawData;
    private customerList: string[] = [];
    private baseUrl = environment.baseUrl;
    private documentMap: object = {};
    constructor(private http: HttpClient) {}

    setDocumentList(documentList: string[]) {
        this.documentList = documentList;
    }

    getDocumentList() {
        return this.documentList;
    }

    setCustomerList(customerList: string[]) {
      this.customerList = customerList;
    }

    getCustomerList() {
      return this.customerList;
    }

    setRawData(rawData: any) {
      this.rawData = rawData;
    }

    getRawData() {
      return this.rawData;
    }

    setDocumentMap(documentMap: object) {
      this.documentMap = documentMap;
    }

    getDocumentMap() {
        return this.documentMap;
    }

    setBaseUrl(baseUrl: string) {
      this.baseUrl = baseUrl;
    }

    getBaseUrl() {
        return this.baseUrl;
    }

    InitializeData() {
      const service = this;
      const promise = new Promise(function(resolve, reject) {
        service.callServer('/listCustomers', function(response, component) {
          if (!response) {
            return;
          }
          const dataMap = response.dataMap;
          component.customerList = Object.keys(dataMap);
          component.documentList = Object.keys(response.documentMap);
          component.documentMap = response.documentMap;
          component.rawData = dataMap;
          resolve(dataMap);
        }, 'get', null);
      });
      return promise;
    }

    callServer(apiPath, callback, method, requestBody: any) {
      const headers = new HttpHeaders()
            .set('Authorization', 'my-auth-token')
            .set('Content-Type', 'application/json');
      const self = this;

      if (method === 'get') {
        this.http.get(this.baseUrl + apiPath, {
          headers
        })
        .subscribe(data => {
          callback(data, self);
        });
      } else if (method === 'post') {
        this.http.post<any>(this.baseUrl + apiPath, requestBody)
        .subscribe(data => {
          callback(data, self);
        });
      }
    }
}
