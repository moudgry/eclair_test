import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { HomePage } from "./home.page";

@NgModule({
  imports: [
    CommonModule,
    HomePage,
    RouterModule.forChild([{ path: '', component: HomePage }])
  ],
  declarations: []
})
export class HomeModule {}
