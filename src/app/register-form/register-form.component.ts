import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {IonicModule} from "@ionic/angular";
import {CommonModule} from "@angular/common";
import {AuthService} from "../../services/auth.service";
import {IRegisterRequest} from "../../requests/signup.request";
import {Router, RouterLink} from "@angular/router";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    CommonModule,
    RouterLink
  ],
  standalone: true
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  ionicForm!: FormGroup;
  private subscriptions: Subscription[] = [];

  constructor(public formBuilder: FormBuilder, private authService: AuthService, private router: Router,
  ) {
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sb) => sb.unsubscribe());
  }

  ngOnInit() {
    this.ionicForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  submitForm = () => {
    this.ionicForm.markAllAsTouched();
    if (this.ionicForm.valid) {
      const data: IRegisterRequest = {
        name: this.ionicForm.get('name')?.value,
        email: this.ionicForm.get('email')?.value,
        password: this.ionicForm.get('password')?.value,
      }

      const registerAub = this.authService.register(data).subscribe({
          next:
            (resp: any) => {
              localStorage.setItem('token', resp.token);
              localStorage.setItem('user', JSON.stringify(resp.user));
              this.router.navigate(['/contacts']).then()
            }
          ,
          error: (error) =>
            console.log(error)
        }
      )
      this.subscriptions.push(registerAub)

    }
  };
}
