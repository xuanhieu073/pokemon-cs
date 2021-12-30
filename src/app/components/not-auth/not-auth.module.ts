import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotAuthComponent } from "./not-auth/not-auth.component";
import { RouterModule } from "@angular/router";

@NgModule({
  declarations: [NotAuthComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: "", component: NotAuthComponent }]),
  ],
})
export class NotAuthModule {}
