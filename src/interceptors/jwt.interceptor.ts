import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest,} from '@angular/common/http';
import {Observable} from 'rxjs';
import {AuthService} from "../services/auth.service";
import {ILoginResult} from "../models/IUser";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {
  }

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const authState: ILoginResult | undefined = this.authService.currentAuthStateValue;
    if (authState && authState.token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
    }
    return next.handle(request);
  }
}
