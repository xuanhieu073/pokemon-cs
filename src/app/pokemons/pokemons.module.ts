import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ListComponent } from "./list/list.component";
import { DetailsComponent } from "./details/details.component";
import { RouterModule, Routes } from "@angular/router";
import { ReactiveFormsModule } from "@angular/forms";

const routes: Routes = [
  { path: "", component: ListComponent },
  { path: ":id", component: DetailsComponent },
];

@NgModule({
  declarations: [ListComponent, DetailsComponent],
  imports: [CommonModule, ReactiveFormsModule, RouterModule.forChild(routes)],
})
export class PokemonsModule {}
