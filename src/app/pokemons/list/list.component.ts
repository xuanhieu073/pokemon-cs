import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { Router } from "@angular/router";
import { debounceTime, tap } from "rxjs";
import { ListStore } from "./list.store";

@Component({
  selector: "app-list",
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ul class="pagination">
        <li class="rounded border dark:border-gray-700">
          <button
            [disabled]="vm.page === 1"
            (click)="setPaginator(vm.page - 2)"
            class="px-2 py-[2px] dark:text-gray-200"
          >
            <
          </button>
        </li>
        <ng-container
          *ngFor="let page of [].constructor(vm.totalPages); index as i"
        >
          <li
            class="rounded border dark:border-gray-700 p-[1px]"
            *ngIf="
              i < 1 ||
              i === vm.page - 1 ||
              i === vm.totalPages / 2 ||
              i === vm.totalPages - 1 ||
              i % round(vm.totalPages / 6) == 0
            "
            [class.active]="i === vm.page - 1"
          >
            <button
              *ngIf="
                i < 1 ||
                i === vm.page - 1 ||
                i === vm.totalPages / 2 ||
                i === vm.totalPages - 1
              "
              (click)="setPaginator(i)"
              class="px-2 py-[2px] dark:text-gray-200"
            >
              {{ i + 1 }}
            </button>
          </li>
        </ng-container>
        <li class="rounded border dark:border-gray-700">
          <button
            [disabled]="vm.page === vm.totalPages"
            (click)="setPaginator(vm.page)"
            class="px-2 py-[2px] dark:text-gray-200"
          >
            >
          </button>
        </li>
      </ul>
      <div
        class="w-80 h-8 mx-auto dark:border-gray-700 border rounded-lg overflow-hidden mb-4 px-2 flex items-center"
      >
        <input
          class="outline-none w-full text-sm font-normal bg-transparent dark:text-gray-200"
          type="text"
          placeholder="search pokemon name"
          [formControl]="query"
        />
      </div>
      <div class="py-10" *ngIf="vm.isLoading; else pokemonContents">
        <div
          class="h-10 w-10 mx-auto rounded-full border-4 border-blue-400 border-r-transparent animate-spin mb-10"
        ></div>
        <p class="text-gray-800 dark:text-gray-200 text-center">loading...</p>
      </div>
      <ng-template #pokemonContents>
        <!-- <ul class="pokemon-list" *ngIf="vm.pokemons.length">
          <li class="pokemon-item" *ngFor="let pokemon of vm.pokemons">
            <a [routerLink]="[pokemon.id]">{{ pokemon.name }}</a>
          </li>
        </ul> -->
        <ul class="pokemon-grid">
          <li
            class="border border-green-400 dark:border-green-900 rounded-lg flex flex-col overflow-hidden"
            *ngFor="let pokemon of vm.pokemons"
          >
            <span class="text-right px-2 py-1 dark:text-gray-200"
              >#{{ pokemon.id.padStart(3, "0") }}</span
            >
            <div class="w-full h-full flex justify-center px-2 py-1">
              <img
                src="/assets/images/poke-ball.png"
                [srcset]="pokemon.image"
                alt="poke-image"
                class="object-cover"
              />
            </div>
            <a
              [routerLink]="[pokemon.id]"
              queryParamsHandling="preserve"
              class="bg-green-500 dark:bg-green-900 text-center text-white px-2 py-1"
              >{{ pokemon.name }}</a
            >
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

  constructor(private listStore: ListStore, private router: Router) {
    this.listStore.queryEffect(this.query.valueChanges.pipe(debounceTime(500)));
  }

  ngOnInit(): void {}

  setPaginator(page: number) {
    this.router.navigate(["/pokemons"], { queryParams: { page: page + 1 } });
  }
}
