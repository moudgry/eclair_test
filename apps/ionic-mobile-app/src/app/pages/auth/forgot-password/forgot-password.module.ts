import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ForgotPasswordPage } from "./forgot-password.page";

@NgModule({
  imports: [
    CommonModule,
    ForgotPasswordPage,
    RouterModule.forChild([{ path: '', component: ForgotPasswordPage }])
  ],
  declarations: []
})
export class ForgotPasswordModule {}
