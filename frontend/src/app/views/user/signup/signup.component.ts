import { Component } from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {LoginDataType} from "../../../../types/login-data.type";
import {AuthResponseType} from "../../../../types/auth-response.type";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
import {SignupDataType} from "../../../../types/signup-data.type";
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern('^([А-ЯЁ][а-яё]+)(\\s[А-ЯЁ][а-яё]+)*\\s*$')]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.pattern('^(?=^.{8,}$)((?=.*\\d)|(?=.*\\W+))(?![.\\n])(?=.*[A-Z]).*$')]],
    agree: [false, Validators.requiredTrue],
  });

  constructor(private fb: FormBuilder,
              private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router) {
  }

  signup() {
    this.signupForm.markAllAsTouched();
    if (this.signupForm.value.agree === false) {
      this._snackBar.open('Примите условия пользовательского соглашения и подтвердите согласие на обработку персональных данных.');
    }

    if (this.signupForm.valid && this.signupForm.value.name && this.signupForm.value.email && this.signupForm.value.password) {
      const userData: SignupDataType = {
        name: this.signupForm.value.name,
        email: this.signupForm.value.email,
        password: this.signupForm.value.password
      }

      this.authService.signup(userData)
        .subscribe({
          next: (data: AuthResponseType | DefaultResponseType) => {
            let error = null;
            if ((data as DefaultResponseType).error !== undefined) {
              error = (data as DefaultResponseType).message;
            }

            const signupResponse = data as AuthResponseType;

            if (!signupResponse.accessToken || !signupResponse.refreshToken || !signupResponse.userId) {
              error = 'Ошибка регистрации';
            }

            if (error) {
              this._snackBar.open(error);
              throw new Error(error);
            }

            this.authService.setTokens(signupResponse.accessToken, signupResponse.refreshToken);
            this.authService.userId = signupResponse.userId;

            this._snackBar.open('Вы успешно зарегистрировались');
            this.router.navigate(['/']).then();

          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка регистрации');
            }
          }
        })
    }
  }
}
