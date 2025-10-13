import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CartPage } from "./cart.page";

@NgModule({
  imports: [
    CommonModule,
    CartPage,
    RouterModule.forChild([{ path: '', component: CartPage }])
  ],
  declarations: []
})
export class CartModule {}
