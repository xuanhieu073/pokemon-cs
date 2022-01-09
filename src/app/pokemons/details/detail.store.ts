import { Injectable } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ComponentStore } from "@ngrx/component-store";
import {
  combineLatest,
  map,
  of,
  pluck,
  switchMap,
  tap,
  withLatestFrom,
} from "rxjs";
import {
  SimplifiedPokemon,
  Species,
  SpeciesDeails,
} from "src/app/models/pokemon";
import { BackendService } from "src/app/services/backend.service";
import { AuthStore } from "src/app/store/auth.store";

export interface Color {
  background: string[];
  primary: string[];
  text: string[];
}
export interface DetailsState {
  fromPage: number;
  isLoading: boolean;
  id: string;
  pokemon: SimplifiedPokemon;
  species: SpeciesDeails;
  color: Color;
}

@Injectable()
export class DetailsStore extends ComponentStore<DetailsState> {
  vm$ = this.select((s) => s);
  pokemonId$ = this.select((s) => s.id, { debounce: true });
  pokemonTypeColorMap: Record<string, Color> = {
    normal: {
      background: ["bg-gray-400"],
      primary: ["bg-gray-400", "border-gray-400"],
      text: ["text-gray-500"],
    },
    fire: {
      background: ["bg-red-400"],
      primary: ["bg-red-400", "border-red-400"],
      text: ["text-red-600"],
    },
    water: {
      background: ["bg-blue-500"],
      primary: ["bg-blue-400", "border-blue-400"],
      text: ["text-blue-600"],
    },
    electric: {
      background: ["yellow-400"],
      primary: ["bg-yellow-400", "border-yellow-400"],
      text: ["text-yellow-600"],
    },
    grass: {
      background: ["bg-green-500"],
      primary: ["bg-green-400", "border-green-400"],
      text: ["text-green-600"],
    },
    psychic: {
      background: ["bg-pink-500"],
      primary: ["bg-pink-400", "border-pink-400"],
      text: ["text-pink-600"],
    },
    dark: {
      background: ["bg-fuchsia-500"],
      primary: ["bg-fuchsia-400", "border-fuchsia-400"],
      text: ["text-fuchsia-600"],
    },
    fairy: {
      background: ["bg-rose-500"],
      primary: ["bg-rose-400", "border-rose-400"],
      text: ["text-rose-600"],
    },
    ice: {
      background: ["bg-cyan-500"],
      primary: ["bg-cyan-400", "border-cyan-400"],
      text: ["text-cyan-600"],
    },
    poison: {
      background: ["bg-purple-500"],
      primary: ["bg-purple-400", "border-purple-400"],
      text: ["text-orange-400"],
    },
    rock: {
      background: ["bg-gray-500"],
      primary: ["bg-gray-400", "border-gray-400"],
      text: ["text-orange-400"],
    },
    dragon: {
      background: ["bg-indigo-500"],
      primary: ["bg-indigo-400", "border-indigo-400"],
      text: ["text-orange-400"],
    },
    steel: {
      background: ["bg-stone-300"],
      primary: ["bg-stone-200", "border-stone-200"],
      text: ["text-orange-400"],
    },
    bug: {
      background: ["bg-lime-500"],
      primary: ["bg-lime-400", "border-lime-400"],
      text: ["text-orange-600"],
    },
    fighting: {
      background: ["bg-emerald-400"],
      primary: ["bg-emerald-300", "border-emerald-300"],
      text: ["text-orange-500"],
    },
    ghost: {
      background: ["bg-fuchsia-700"],
      primary: ["bg-fuchsia-600", "border-fuchsia-600"],
      text: ["text-orange-800"],
    },
    flying: {
      background: ["bg-teal-400"],
      primary: ["bg-teal-300", "border-teal-300"],
      text: ["text-orange-500"],
    },
  };

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
      species: null,
      color: null,
    });
    this.initalizeEffect();
    this.fetchPokemonEffect(this.route.params.pipe(pluck("id")));
  }

  initalizeEffect = this.effect((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.route.queryParams.pipe(pluck("page"))),
      tap(([, page]) => {
        this.patchState({
          fromPage: page,
          color: this.pokemonTypeColorMap["normal"],
        });
      })
    )
  );

  fetchPokemonEffect = this.effect<string>((id$) =>
    id$.pipe(
      tap((id) => {
        this.patchState({ isLoading: true, id });
      }),
      switchMap((id) =>
        combineLatest([of(id), this.backend.getPokemonDetail(id)])
      ),
      switchMap(([id, pokemon]) => {
        return combineLatest([of(pokemon), this.backend.getPokemonSpecies(id)]);
      }),
      tap(([pokemon, species]) => {
        let color = this.pokemonTypeColorMap[pokemon.type]
          ? this.pokemonTypeColorMap[pokemon.type]
          : this.pokemonTypeColorMap["normal"];
        species.flavor_text_entries[0].flavor_text.replace("\n", "");
        this.patchState({ isLoading: false, pokemon, color, species });
      })
    )
  );

  nextIdEffect = this.effect((trigger$) =>
    trigger$.pipe(
      withLatestFrom(this.pokemonId$),
      tap(([, id]) => {
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
