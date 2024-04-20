import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ILoginRequest} from "../requests/login.request";
import {environment} from "../environments/environment";
import {IRegisterRequest} from "../requests/signup.request";
import {BehaviorSubject, catchError, Observable, tap} from "rxjs";
import {LoggerService} from "./logger.service";
import {Storage} from "@capacitor/storage";
import {ILoginResult} from "../models/IUser";
import {Router} from "@angular/router";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private bsAuthState: BehaviorSubject<ILoginResult | undefined> = new BehaviorSubject<ILoginResult | undefined>(undefined);
  private AUTH_STATE: string = 'USER'

  constructor(private http: HttpClient, protected logger: LoggerService, protected router: Router,
  ) {
  }

  get currentAuthStateValue(): ILoginResult | undefined {
    return this.bsAuthState?.value;
  }

  get authState(): Observable<ILoginResult | undefined> {
    return this.bsAuthState.asObservable();
  }

  login(data: ILoginRequest): Observable<ILoginResult | undefined> {
    const url = `${environment.urlBase}/api/v1/auth/login`;
    return this.http.post<ILoginResult>(url, data).pipe(
      tap(async (result: ILoginResult) => {
        if (result && result.user) {
          await this.setAuthToLocalStorage(result);
        }
      }),
      catchError(this.logger.handleError('login', undefined))
    );
  }

  register(data: IRegisterRequest): Observable<ILoginResult | undefined> {
    const url = `${environment.urlBase}/api/v1/auth/register`;
    return this.http.post<ILoginResult>(url, data).pipe(
      tap(async (result: ILoginResult) => {
        if (result && result.user) {
          await this.setAuthToLocalStorage(result);
        }
      }),
      catchError(this.logger.handleError('register', undefined))
    );
  }


  public async readStatus(): Promise<void> {
    try {
      const authData = await Storage.get({key: this.AUTH_STATE});
      if (authData && authData?.value) {
        const parsedAuthData = JSON.parse(authData.value);
        const data: ILoginResult = {
          token: parsedAuthData.token || null,
          refreshToken: parsedAuthData.refreshToken || null,
          expiresAt: parsedAuthData.expiresAt || null,
          user: parsedAuthData.user || null,
        }

        this.bsAuthState.next(data);
      }
    } catch (error) {
      console.error(error);
    }
  }

  public async logout(): Promise<void> {
    await Storage.clear();
    this.bsAuthState.next(undefined);
    this.router.navigate(['/login']).then()
    location.reload();
  }


  private async setAuthToLocalStorage(
    result: ILoginResult,
    authNext: boolean = true
  ): Promise<void> {
    const storage = {key: this.AUTH_STATE, value: JSON.stringify(result)};
    await Storage.set(storage);
    if (authNext) {
      this.bsAuthState.next(result);
    }
  }
}
