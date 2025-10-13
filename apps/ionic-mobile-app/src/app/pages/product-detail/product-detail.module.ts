import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProductDetailPage } from "./product-detail.page";

@NgModule({
  imports: [
    CommonModule,
    ProductDetailPage,
    RouterModule.forChild([{ path: '', component: ProductDetailPage }])
  ],
  declarations: []
})
export class ProductDetailModule {}
