import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from './../services';
@Injectable()

export class Interceptor implements HttpInterceptor {

  constructor(private authService : AuthenticationService)
  {

  }

    intercept (req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      let authReq=req;
      let currentUser:any =this.authService.getcurrentUser();
      if(currentUser && currentUser.data && currentUser.data.token)
      {
         authReq = req.clone({
          headers: req.headers.set('Authorization', currentUser.data.token)
        });
      } 
        return next.handle(authReq);
      }
}