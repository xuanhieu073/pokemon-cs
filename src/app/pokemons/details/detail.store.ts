import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ComponentStore } from "@ngrx/component-store";
import { map, pluck, switchMap, tap, withLatestFrom } from "rxjs";
import { SimplifiedPokemon } from "src/app/models/pokemon";
import { BackendService } from "src/app/services/backend.service";
import { AuthStore } from "src/app/store/auth.store";

export enum colors {
  water = "blue",
  fire = "red",
  grass = "green",
  default = "orange",
}

export interface DetailsState {
  fromPage: number;
  isLoading: boolean;
  id: string;
  pokemon: SimplifiedPokemon;
  color: colors;
}

@Injectable()
export class DetailsStore extends ComponentStore<DetailsState> {
  vm$ = this.select((s) => s);
  pokemonId$ = this.select((s) => s.id, { debounce: true });

  constructor(
    private route: ActivatedRoute,
    private backend: BackendService,
    private router: Router,
    private auth: AuthStore
  ) {
    super({
      fromPage: 1,
      isLoading: false,
      id: "0",
      pokemon: null,
      color: colors.default,
    });
    this.initalizeEffect();
    this.fetchPokemonEffect(this.route.params.pipe(pluck("id")));
  }

  initalizeEffect = this.effect((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.route.queryParams.pipe(pluck("page"))),
      tap(([, page]) => {
        this.patchState({ fromPage: page });
      })
    )
  );

  fetchPokemonEffect = this.effect<string>((id$) =>
    id$.pipe(
      tap((id) => {
        this.patchState({ isLoading: true, id });
      }),
      switchMap((id) => this.backend.getPokemonDetail(id)),
      tap((pokemon) => {
        let color = colors.default;
        switch (pokemon.type) {
          case "water":
            color = colors.water;
            break;
          case "fire":
            color = colors.fire;
            break;
          case "grass":
            color = colors.grass;
            break;
          default:
            color: colors.default;
        }
        this.patchState({ isLoading: false, pokemon, color });
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

  like = this.auth.like;
  disLike = this.auth.disLike;
}
