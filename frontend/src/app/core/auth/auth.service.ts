import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, Subject, throwError} from "rxjs";
import {AuthResponseType} from "../../../types/auth-response.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment";
import {LoginDataType} from "../../../types/login-data.type";
import {UserInfoType} from "../../../types/user-info.type";
import {SignupDataType} from "../../../types/signup-data.type";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public accessTokenKey: string = 'accessToken';
  public refreshTokenKey: string = 'refreshToken';
  public userIdKey: string = 'userId';

  public isLogged$: Subject<boolean> = new Subject<boolean>();
  private isLogged: boolean = false;

  constructor(private http: HttpClient) {
    this.isLogged = !!localStorage.getItem(this.accessTokenKey);
  }

  login(userData: LoginDataType): Observable<DefaultResponseType | AuthResponseType> {
    return this.http.post<DefaultResponseType | AuthResponseType>(environment.api + 'login', userData)
  }

  logout(): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'logout', this.getTokens().refreshToken)
  }

  signup(userData: SignupDataType): Observable<DefaultResponseType | AuthResponseType> {
    return this.http.post<DefaultResponseType | AuthResponseType>(environment.api + 'signup', userData)
  }

  getUserInfo(): Observable<DefaultResponseType | UserInfoType> {
    return this.http.get<DefaultResponseType | UserInfoType>(environment.api + 'users')
  }

  refresh(): Observable<DefaultResponseType | AuthResponseType> {
    const tokens = this.getTokens();
    if (tokens && tokens.refreshToken) {
      return this.http.post<DefaultResponseType | AuthResponseType>(environment.api + 'refresh', {
        refreshToken: tokens.refreshToken,
      })
    }
    throw throwError(() => 'Can not use token');
  }

  public getIsLoggedIn () {
    return this.isLogged;
  }

  public setTokens(accessToken: string, refreshToken: string):void {
    localStorage.setItem(this.accessTokenKey, accessToken);
    localStorage.setItem(this.refreshTokenKey, refreshToken);
    this.isLogged = true;
    this.isLogged$.next(true);
  }

  public removeTokens():void {
    localStorage.removeItem(this.accessTokenKey);
    localStorage.removeItem(this.refreshTokenKey);
    this.isLogged = false;
    this.isLogged$.next(false);
  }

  public getTokens(): {accessToken: string | null, refreshToken: string | null} {
    return {
      accessToken: localStorage.getItem(this.accessTokenKey),
      refreshToken: localStorage.getItem(this.refreshTokenKey)
    }
  }

  get userId(): null | string {
    return localStorage.getItem(this.userIdKey);
  }

  set userId(id: string | null) {
    if (id) {
      localStorage.setItem(this.userIdKey, id);
    } else {
      localStorage.removeItem(this.userIdKey);
    }
  }


}
