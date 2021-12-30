import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PokemonsGuard } from "./guards/pokemons.guard";

const routes: Routes = [
  { path: "", redirectTo: "pokemons", pathMatch: "full" },
  {
    path: "pokemons",
    loadChildren: () =>
      import("./pokemons/pokemons.module").then((m) => m.PokemonsModule),
    canLoad: [PokemonsGuard],
  },
  {
    path: "not-auth",
    loadChildren: () =>
      import("./components/not-auth/not-auth.module").then(
        (m) => m.NotAuthModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
