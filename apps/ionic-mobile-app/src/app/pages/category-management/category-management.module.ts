import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { CategoryManagementPage } from "./category-management.page";

@NgModule({
  imports: [
    CommonModule,
    CategoryManagementPage,
    RouterModule.forChild([{ path: '', component: CategoryManagementPage }])
  ],
  declarations: []
})
export class CategoryManagementModule {}
