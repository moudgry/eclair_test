import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CheckoutPage } from "./checkout.page";

@NgModule({
  imports: [
    CommonModule,
    CheckoutPage,
    RouterModule.forChild([{ path: '', component: CheckoutPage }])
  ],
  declarations: []
})
export class CheckoutModule {}
