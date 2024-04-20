import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthService} from "../services/auth.service";
import {AlertService} from "../services/alert.service";


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private identityService: AuthService,
    private alertService: AlertService
  ) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        let error;
        console.error('An error occurred:');

        if (err.error instanceof Error) {
          // A client-side or network error occurred. Handle it accordingly.
          error = err.error.message;
          console.error('An error occurred:', error);
        } else {
          // The backend returned an unsuccessful response code.
          // The response body may contain clues as to what went wrong,
          if (err.error) {
            error = err.error.message;
          } else {
            error = err.message || err.statusText;
          }

          console.error(
            `Backend returned code ${err.status}, body was: ${error}`
          );
        }

        this.alertService.toastAlert(error);
        this.alertService.error(error, false, 10);

        if (err && err.status === 401) {
          console.log('ERROR 401 UNAUTHORIZED'); // in case of an error response the error message is displayed
          this.identityService.logout();
        }

        return throwError(error);
      })
    );
  }
}
