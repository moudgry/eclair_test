import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { ProductsPage } from "./products.page";
import { ProductCardComponent } from "../../components/product-card/product-card.component";

@NgModule({
  imports: [
    CommonModule,
    ProductsPage,
    ProductCardComponent,
    RouterModule.forChild([{ path: '', component: ProductsPage }])
  ],
  declarations: []
})
export class ProductsModule {}
