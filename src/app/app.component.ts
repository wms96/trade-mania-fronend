import {Component, OnDestroy} from '@angular/core';
import {NavController, Platform} from "@ionic/angular";
import {AuthService} from "../services/auth.service";
import {Router} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnDestroy {
  isLogged: undefined | false | boolean = false;
  private subscriptions: Subscription[] = [];

  constructor(private platform: Platform,
              private navCtrl: NavController,
              private router: Router,
              private identityService: AuthService,
  ) {
    this.initializeApp();
  }

  logout(): void {
    this.identityService.logout()
  }

  initializeApp(): void {
    this.platform.ready().then(async () => {
      const identitySub = this.identityService.authState.subscribe(async (authState) => {
        this.isLogged =
          authState && authState.user !== null && authState.token !== null;

        if (this.isLogged) {
          if (this.router.url === '/login') {
            await this.navCtrl.navigateRoot('/contacts', {
              animated: true,
              animationDirection: 'forward',
            });
          }
        } else {
          await this.navCtrl.navigateRoot('/login', {
            animated: true,
            animationDirection: 'forward',
          });
        }
      });
      this.subscriptions.push(identitySub)
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }
}
