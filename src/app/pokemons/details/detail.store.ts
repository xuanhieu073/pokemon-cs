import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ComponentStore } from "@ngrx/component-store";
import { map, pluck, switchMap, tap, withLatestFrom } from "rxjs";
import { SimplifiedPokemon } from "src/app/models/pokemon";
import { BackendService } from "src/app/services/backend.service";

export interface DetailsState {
  isLoading: boolean;
  id: string;
  pokemon: SimplifiedPokemon;
}

@Injectable()
export class DetailsStore extends ComponentStore<DetailsState> {
  vm$ = this.select((s) => s);
  pokemonId$ = this.select((s) => s.id, { debounce: true });

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
    private router: Router
  ) {
    super({ isLoading: false, id: "0", pokemon: null });
    this.fetchPokemonEffect(this.route.params.pipe(pluck("id")));
  }

  fetchPokemonEffect = this.effect<string>((id$) =>
    id$.pipe(
      tap((id) => {
        this.patchState({ isLoading: true, id });
      }),
      switchMap((id) => this.backend.getPokemonDetail(id)),
      tap((pokemon) => {
        this.patchState({ isLoading: false, pokemon });
      })
    )
  );

  nextIdEffect = this.effect((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.pokemonId$),
      tap(([, id]) => {
        console.log({ id });
        const nextId = Number(id) + 1;
        this.router.navigate(["/pokemons", nextId]);
      })
    )
  );

  prevIdEffect = this.effect((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.pokemonId$),
      tap(([, id]) => {
        console.log({ id });
        const prevId = Number(id) - 1 || 1;
        this.router.navigate(["/pokemons", prevId]);
      })
    )
  );
}
