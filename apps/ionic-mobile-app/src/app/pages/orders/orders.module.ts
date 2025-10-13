import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { OrdersPage } from "./orders.page";

@NgModule({
  imports: [
    CommonModule,
    OrdersPage,
    RouterModule.forChild([{ path: '', component: OrdersPage }])
  ],
  declarations: []
})
export class OrdersModule {}
