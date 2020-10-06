import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, } from 'rxjs/operators';
import { throwError, Observable, } from 'rxjs';


@Injectable({ providedIn: 'root' })

export class ApiService {
    constructor(private http: HttpClient) {
    }

    async getResponse(method, url, params = {}) {
        var requestObject: any;
        var response

        switch (method) {
            case 'get':
                requestObject = this.http.get(url, { params: params });
                break;
            case 'post':
                requestObject = this.http.post(url, params);
                break;
            case 'put':
                requestObject = this.http.put(url, params);
                break;
            case 'delete':
                requestObject = this.http.delete(url, params);
                break;
            default:
                requestObject = this.http.get(url, { params });
        }
        return await requestObject.toPromise()
            .then(data => { return data })
            .catch(error => {return error})
    }

}