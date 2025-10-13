import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProductManagementPage } from "./product-management.page";

@NgModule({
  imports: [
    CommonModule,
    ProductManagementPage,
    RouterModule.forChild([{ path: '', component: ProductManagementPage }])
  ],
  declarations: []
})
export class ProductManagementModule {}
