import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormRequestComponent} from './components/form-request/form-request.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";


@NgModule({
  declarations: [
    FormRequestComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  exports: [
    FormRequestComponent
  ]
})
export class SharedModule {
}
