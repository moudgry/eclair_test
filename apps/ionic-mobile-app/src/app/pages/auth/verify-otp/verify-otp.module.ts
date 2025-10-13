import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { VerifyOtpPage } from "./verify-otp.page";

@NgModule({
  imports: [
    CommonModule,
    VerifyOtpPage,
    RouterModule.forChild([{ path: '', component: VerifyOtpPage }])
  ],
  declarations: []
})
export class VerifyOtpModule {}
