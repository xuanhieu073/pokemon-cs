import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { debounceTime, tap } from "rxjs";
import { ListStore } from "./list.store";

@Component({
  selector: "app-list",
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ul class="pagination">
        <li class="pagination-item">
          <button
            [disabled]="vm.page === 1"
            (click)="setPaginator(vm.page - 2)"
          >
            <
          </button>
        </li>
        <ng-container
          *ngFor="let page of [].constructor(vm.totalPages); index as i"
        >
          <li
            class="pagination-item"
            *ngIf="
              i < 1 ||
              i === vm.page - 1 ||
              i === vm.totalPages / 2 ||
              i === vm.totalPages - 1 ||
              i % round(vm.totalPages / 6) == 0
            "
            [class.active]="i === vm.page - 1"
          >
            <a
              *ngIf="
                i < 1 ||
                i === vm.page - 1 ||
                i === vm.totalPages / 2 ||
                i === vm.totalPages - 1
              "
              class="pagination-link"
              (click)="setPaginator(i)"
              >{{ i }}</a
            >
          </li>
        </ng-container>
        <li class="pagination-item">
          <button
            [disabled]="vm.page === vm.totalPages"
            (click)="setPaginator(vm.page)"
          >
            >
          </button>
        </li>
      </ul>
      <div
        class="w-80 h-8 mx-auto border rounded-lg overflow-hidden mb-4 px-2 flex items-center"
      >
        <input
          class="outline-none w-full text-sm font-normal"
          type="text"
          placeholder="search pokemon name"
          [formControl]="query"
        />
      </div>
      <div class="loading-block" *ngIf="vm.isLoading; else pokemonContents">
        <p>loading...</p>
      </div>
      <ng-template #pokemonContents>
        <!-- <ul class="pokemon-list" *ngIf="vm.pokemons.length">
          <li class="pokemon-item" *ngFor="let pokemon of vm.pokemons">
            <a [routerLink]="[pokemon.id]">{{ pokemon.name }}</a>
          </li>
        </ul> -->
        <ul class="pokemon-grid">
          <li class="pokemon-grid-item" *ngFor="let pokemon of vm.pokemons">
            <span>#{{ pokemon.id.padStart(3, "0") }}</span>
            <div>
              <img
                error="https://mir-s3-cdn-cf.behance.net/project_modules/disp/13ff4e19399069.562d9bb4f1a42.png"
                src="https://s2.coinmarketcap.com/static/img/coins/200x200/8303.png"
                [srcset]="pokemon.image"
                alt="poke-image"
              />
            </div>
            <a [routerLink]="[pokemon.id]">{{ pokemon.name }}</a>
          </li>
        </ul>
        <!-- <code>{{ vm | json }}</code> -->
      </ng-template>
    </ng-container>
  `,
  styleUrls: ["list.component.scss"],
  providers: [ListStore],
})
export class ListComponent implements OnInit {
  round = Math.round;
  vm$ = this.listStore.vm$;
  query = new FormControl();

  constructor(private listStore: ListStore) {
    this.listStore.queryEffect(this.query.valueChanges.pipe(debounceTime(500)));
  }

  ngOnInit(): void {
    // this.query.valueChanges
    //   .pipe(
    //     debounceTime(500),
    //     tap((query) => {
    //       this.listStore.setQuery(query);
    //     })
    //   )
    //   .subscribe();
  }

  setPaginator(page: number) {
    this.listStore.setPagination({
      page: page + 1,
      limit: 20,
      offset: page * 20,
    });
  }
}
