import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ResetPasswordPage } from "./reset-password.page";

@NgModule({
  imports: [
    CommonModule,
    ResetPasswordPage,
    RouterModule.forChild([{ path: '', component: ResetPasswordPage }])
  ],
  declarations: []
})
export class ResetPasswordModule {}
