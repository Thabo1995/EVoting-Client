import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpResponse,
    HttpErrorResponse
  } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
// import { LoaderService } from '../_services/loader.service';


@Injectable()
export class TokenInterceptor implements HttpInterceptor {
    private requests: HttpRequest<any>[] = [];
    private totalRequests = 0;
    constructor(
      private router: Router,
      // private loaderService: LoaderService
      ) {}


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = 'Token ' + localStorage.getItem('token');
    this.totalRequests++;
    // this.loaderService.isLoading.next(true);

    if (token) {
      request = request.clone({
        setHeaders: {
          'Authorization': token
        }
      });
    }

    if (!request.headers.has('Content-Type')) {
      request = request.clone({
        setHeaders: {
          'content-type': 'application/json'
        }
      });
    }

    request = request.clone({
      headers: request.headers.set('Accept', 'application/json')
    });

    return next.handle(request).pipe(
      map((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          console.log('event--->>>', event);
          this.totalRequests--;
          // this.loaderService.isLoading.next(false);
          if (this.totalRequests === 0) {
            // this.loaderService.isLoading.next(false);
          }
        }
        return event;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403 || error.status === 500) {
          if (error.error.success === false) {
          } else {
            this.router.navigate(['/']);
          }
        }
        return throwError(error);
      }));
    }
}
