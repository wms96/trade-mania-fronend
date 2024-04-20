import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {ILoginRequest} from "../../requests/login.request";
import {RouterLink} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  standalone: true
})
export class LoginFormComponent implements OnInit, OnDestroy {
  ionicForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(public formBuilder: FormBuilder, private authService: AuthService) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit(): void {
    this.ionicForm = this.formBuilder.group({
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  submitForm = () => {
    this.ionicForm.markAllAsTouched();
    if (this.ionicForm.valid) {
      const data: ILoginRequest = {
        email: this.ionicForm.get('email')?.value,
        password: this.ionicForm.get('password')?.value,
      }

      const loginSub = this.authService.login(data).subscribe({
          next:
            (resp: any) => {
              console.log('resp ', resp)
              localStorage.setItem('token', resp.token);
              localStorage.setItem('user', JSON.stringify(resp.user));
            }
          ,
          error: (error) =>
            console.log(error)
        }
      )
      this.subscriptions.push(loginSub)
    }
  };
}
