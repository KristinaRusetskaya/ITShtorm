import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormRequestComponent} from './components/form-request/form-request.component';
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import { CardItemComponent } from './components/card-item/card-item.component';
import {RouterLink} from "@angular/router";


@NgModule({
  declarations: [
    FormRequestComponent,
    CardItemComponent
  ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        HttpClientModule,
        RouterLink,
    ],
  exports: [
    FormRequestComponent,
    CardItemComponent
  ]
})
export class SharedModule {
}
