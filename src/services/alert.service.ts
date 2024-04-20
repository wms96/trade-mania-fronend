import {Injectable} from '@angular/core';
import {NavigationStart, Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {LoadingController, ToastController} from '@ionic/angular';

@Injectable()
export class AlertService {
  private subject = new Subject<any>();
  private keepAfterNavigationChange = false;

  constructor(
    private router: Router,
    public toastController: ToastController,
    public loadingController: LoadingController
  ) {
    // clear alert message on route change
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.keepAfterNavigationChange) {
          // only keep for a single location change
          this.keepAfterNavigationChange = false;
        } else {
          // clear alert
          this.subject.next(null);
        }
      }
    });
  }

  success(
    message: string,
    keepAfterNavigationChange = false,
    clearAfterXSeconds = 0
  ) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({type: 'success', text: message});

    if (clearAfterXSeconds > 0) {
      setTimeout(() => {
        this.clear();
      }, clearAfterXSeconds * 1000);
    }
  }

  error(
    message: string,
    keepAfterNavigationChange = false,
    clearAfterXSeconds = 0
  ) {
    this.keepAfterNavigationChange = keepAfterNavigationChange;
    this.subject.next({type: 'error', text: message});

    if (clearAfterXSeconds > 0) {
      setTimeout(() => {
        this.clear();
      }, clearAfterXSeconds * 1000);
    }
  }

  clear() {
    // clear alert
    this.subject.next(null);
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }

  async toastAlert(
    message: string,
    duration = 2000
  ): Promise<HTMLIonToastElement> {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom',
    });
    toast.present();
    return toast;
  }

  async presentLoading(): Promise<HTMLIonLoadingElement> {
    const handler = await this.loadingController.create({
      message: 'Please wait...',
    });
    await handler.present();
    return handler;
  }
}
