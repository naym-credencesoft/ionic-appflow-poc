import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { SESSION_APP_ID } from './app.component';
import { Logger } from './service/logger.service';
import { TokenStorage } from './token.storage';

const APP_ID_SESSION_KEY = 'APP_ID';
const TOKEN_HEADER_KEY = 'Authorization';
@Injectable()
export class HTTPStatus {
  private requestInFlight$: BehaviorSubject<boolean>;
  constructor() {
    this.requestInFlight$ = new BehaviorSubject(false);
  }

  setHttpStatus(inFlight: boolean) {
    this.requestInFlight$.next(inFlight);
  }

  getHttpStatus(): Observable<boolean> {
    return this.requestInFlight$.asObservable();
  }
}

@Injectable()
export class Interceptor implements HttpInterceptor {

  constructor(private token: TokenStorage, private router: Router, private status: HTTPStatus) { }

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    let authReq = req;
    this.status.setHttpStatus(true);
    //  Logger.log('URL:->' + req.url);
    //   Logger.log('Token:->' + this.token.getToken());
    if (this.token.getToken() != null && req.url.indexOf('googleapis') < 0) {
      //   authReq = req.clone({ headers: req.headers.set(TOKEN_HEADER_KEY, this.token.getToken())});
      authReq = req.clone({
        headers: req.headers.set(TOKEN_HEADER_KEY, this.token.getToken())
          .set(APP_ID_SESSION_KEY, SESSION_APP_ID)
      });
    }
    /*return next.handle(authReq).pipe(
      map(event => {
        return event;
      }),*/
    return next.handle(authReq).pipe(
      map(event => {
        return event;
      }),
      catchError(error => {
        if (error instanceof HttpErrorResponse) {
          Logger.log('error :->' + error.message);
          if (error.status === 401) {
            //  this.router.navigate(['user']);
          }
        }
        return next.handle(req);
      }),
      finalize(() => {
        this.status.setHttpStatus(false);
      })
    );
    /* catchError(error => {
       if (error instanceof HttpErrorResponse) {
         Logger.log('error :->' + error.message);
         if (error.status === 401) {
           this.router.navigate(['user']);
         }
       }
       return error;
     }),
     finalize(() => {
       this.status.setHttpStatus(false);
     })
   );*/
  }

}
