import {HttpClient} from "@angular/common/http";
import { Injectable } from '@angular/core';
import {Observable, Subject} from "rxjs";
import {DefaultResponseType} from "../../../types/default-response.type";
import {environment} from "../../../environments/environment.development";
import {RequestsDataType} from "../../../types/requests-data.type";
import {ContentFormRequestType} from "../../../types/content-form-request.type";

@Injectable({
  providedIn: 'root'
})
export class FormRequestService {
  public showedPopup$: Subject<boolean> = new Subject<boolean>();
  public isContent$: Subject<ContentFormRequestType> = new Subject<ContentFormRequestType>();

  constructor(private http: HttpClient) { }

  requestOrderConsultation(userData: RequestsDataType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', userData);
  }
}
