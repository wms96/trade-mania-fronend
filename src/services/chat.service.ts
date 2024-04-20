import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from 'src/environments/environment';
import {catchError, Observable, tap, throwError} from "rxjs";
import {IMessage} from "../models/IMessage";
import {IPaginator} from "../models/IPaginator";
import {IConversation} from "../models/IConversation";
import {ILoginResult} from "../models/IUser";
import {LoggerService} from "./logger.service";

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private http: HttpClient, private logger: LoggerService) {
  }

  getChat(userId: number, page = 1): Observable<IPaginator<IMessage>> {
    const url = `${environment.urlBase}/api/v1/chat`;
    return this.http.get<IPaginator<IMessage>>(url, {params: {to_user_id: userId, page}}).pipe(
      catchError(error => {
        console.log('error ', error)
        // Handle error logging or any other error handling here
        this.logger.handleError('getChat', error);
        // Return a valid observable to maintain the expected return type
        return throwError(error);
      })
    );
  }

  getChats(): Observable<IConversation[]> {
    const url = `${environment.urlBase}/api/v1/chats`;
    return this.http.get<IConversation[]>(url).pipe(
      catchError(error => {
        // Handle error logging or any other error handling here
        this.logger.handleError('getChat', error);
        // Return a valid observable to maintain the expected return type
        return throwError(error);
      })
    );
  }

  sendMessage(message: string, userId: number) {
    const url = `${environment.urlBase}/api/v1/chat`;
    const data = {
      content: message,
      to_user_id: userId
    };

    return this.http.post(url, data).pipe(
      catchError(error => {
        // Handle error logging or any other error handling here
        this.logger.handleError('getChat', error);
        // Return a valid observable to maintain the expected return type
        return throwError(error);
      })
    );
  }

}
