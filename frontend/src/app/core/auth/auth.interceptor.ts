import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {catchError, finalize, Observable, switchMap, throwError} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {DefaultResponseType} from "../../../types/default-response.type";
import {AuthResponseType} from "../../../types/auth-response.type";
import {Router} from "@angular/router";
// import {LoaderService} from "../../shared/services/loader.service";

@Injectable()
export class AuthInterceptor implements HttpInterceptor{
  constructor(private authService: AuthService, private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // this.loaderService.show();

    const tokens = this.authService.getTokens();
    if (tokens && tokens.accessToken) {
      const authReg = req.clone({
        headers: req.headers.set('x-auth', tokens.accessToken)
      });

      return next.handle(authReg)
        .pipe(
          catchError((error) => {
            if (error.status === 401 && !authReg.url.includes('/login') && !authReg.url.includes('/refresh')) {
              return this.handle401Error(authReg, next);
            }
            return throwError(() => error);
          }),
          // finalize(() => this.loaderService.hide())
        );
    }

    return next.handle(req)
      // .pipe(finalize(() => this.loaderService.hide()));
  }

  handle401Error(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.refresh()
      .pipe(
        switchMap((result: DefaultResponseType | AuthResponseType) => {
          let error = '';
          if ((result as DefaultResponseType).error !== undefined) {
            error = (result as DefaultResponseType).message;
          }

          const refreshResult = result as AuthResponseType;
          if (!refreshResult.accessToken || !refreshResult.refreshToken || !refreshResult.userId) {
            error = 'Ошибка авторизации';
          }

          if (error) {
            return throwError(() => new Error(error));
          }

          this.authService.setTokens(refreshResult.accessToken, refreshResult.refreshToken);

          const authReg = req.clone({
            headers: req.headers.set('x-auth', refreshResult.accessToken)
          });

          return next.handle(authReg);
        }),
        catchError(error => {
          this.authService.removeTokens();
          this.router.navigate(['/']).then();
          return throwError(() => error);
        })
      );
  }
}
