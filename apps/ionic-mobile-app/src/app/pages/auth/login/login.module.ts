import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { LoginPage } from "./login.page";

@NgModule({
  imports: [
    CommonModule,
    LoginPage,
    RouterModule.forChild([{ path: '', component: LoginPage }])
  ],
  declarations: []
})
export class LoginModule {}
