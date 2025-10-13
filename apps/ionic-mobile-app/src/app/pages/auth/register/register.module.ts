import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { RouterModule } from "@angular/router";
import { RegisterPage } from "./register.page";

@NgModule({
  imports: [
    CommonModule,
    RegisterPage,
    RouterModule.forChild([{ path: '', component: RegisterPage }])
  ],
  declarations: []
})
export class RegisterModule {}
