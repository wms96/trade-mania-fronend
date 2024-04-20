import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from "../environments/environment";
import {catchError, Observable} from "rxjs";
import {LoggerService} from "./logger.service";
import {IUser} from "../models/IUser";


@Injectable({
  providedIn: 'root'
})
export class ContactService {


  constructor(private http: HttpClient, protected logger: LoggerService,
  ) {
  }

  get(keyword?: string): Observable<undefined | IUser[]> {
    const url = `${environment.urlBase}/api/v1/contact`;
    let filter = {};
    if (keyword) {
      filter = {keyword}
    }
    return this.http.get<IUser[]>(url, {params: filter}).pipe(
      catchError(this.logger.handleError('login', undefined))
    );
  }
}
