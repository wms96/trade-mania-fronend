import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, of} from 'rxjs';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  // tslint:disable-next-line:variable-name
  private errorMsg = new BehaviorSubject<string>('');

  constructor(
    /*private alertService: AlertService*/
    public toast: ToastController
  ) {
  }

  get errorMessage$() {
    return this.errorMsg.asObservable();
  }

  clear() {
    this.errorMsg.next('');
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   *
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  public handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      const errMsg = error.message || error.statusText || error;

      this.errorMsg.next(operation);
      this.errorMsg.next(errMsg);

      this.toastAlert(errMsg).then(() => {
      });

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  async toastAlert(
    message: string,
    duration = 2000
  ): Promise<HTMLIonToastElement> {
    const toast = await this.toast.create({
      message,
      duration,
      position: 'bottom',
    });
    await toast.present();
    return toast;
  }

  public log(message: string) {
    console.log(`${message}`);
  }
}
