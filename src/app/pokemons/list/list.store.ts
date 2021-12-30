import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { debounceTime, map, switchMap, tap } from "rxjs";
import { Pokemon } from "src/app/models/pokemon";
import { BackendService } from "src/app/services/backend.service";

export interface ListState {
  isLoading: boolean;
  page: number;
  limit: number;
  offset: number;
  totalRows: number;
  pokemons: (Pokemon & { image: string })[];
  orgPokemons: (Pokemon & { image: string })[];
  query: string;
}

@Injectable()
export class ListStore extends ComponentStore<ListState> {
  vm$ = this.select((s) => ({
    ...s,
    totalPages: Math.ceil(s.totalRows / s.limit),
  }));
  paniator$ = this.select(
    this.select((s) => s.limit),
    this.select((s) => s.offset),
    (limit, offset) => ({ limit, offset })
  );

  query$ = this.select((s) => s.query);

  constructor(private backend: BackendService) {
    super({
      isLoading: false,
      page: 1,
      limit: 20,
      offset: 0,
      totalRows: 0,
      pokemons: [],
      orgPokemons: [],
      query: "",
    });
    this.fetchEffect(this.paniator$);
    this.logEffect(this.vm$);
  }

  setPagination = this.updater<{ page: number; limit: number; offset: number }>(
    (state, { page, limit, offset }) => ({ ...state, page, limit, offset })
  );

  logEffect = this.effect<ListState>((vm$) =>
    vm$.pipe(
      tap((vm) => {
        console.log(vm);
      })
    )
  );

  fetchEffect = this.effect<{ limit: number; offset: number }>((paginator$) =>
    paginator$.pipe(
      debounceTime(500),
      tap(() => {
        this.patchState({ isLoading: true });
      }),
      switchMap(({ limit, offset }) => {
        return this.backend.getPokemons(limit, offset);
      }),
      tap(({ results, count }) => {
        this.patchState({
          isLoading: false,
          totalRows: count,
          pokemons: results.map((poke) => ({ ...poke, image: "" })),
          orgPokemons: results.map((poke) => ({ ...poke, image: "" })),
        });
        for (let pokemon of results) {
          this.backend
            .getPokemonDetail(pokemon.id)
            .pipe(
              tap((pokeDetails) => {
                this.setState((s) => {
                  const oldPoke = s.pokemons.find(
                    (poke) => poke.id == pokemon.id
                  );
                  oldPoke.image = pokeDetails.image;
                  return s;
                });
              })
            )
            .subscribe(() => {});
        }
      })
    )
  );

  queryEffect = this.effect<string>((query$) =>
    query$.pipe(
      tap((query) => {
        this.setState((state) => ({
          ...state,
          query,
          pokemons: state.orgPokemons.filter((poke) =>
            poke.name.toLowerCase().includes(query.toLowerCase())
          ),
        }));
      })
    )
  );
}
