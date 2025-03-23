import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SignupComponent } from './signup/signup.component';
import {LoginComponent} from "./login/login.component";
import {ReactiveFormsModule} from "@angular/forms";
import {HttpClientModule} from "@angular/common/http";
import {PoliticComponent} from "./politic/politic.component";


@NgModule({
  declarations: [
    SignupComponent,
    LoginComponent,
    PoliticComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ]
})
export class UserModule { }
