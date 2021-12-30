import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  OnInit,
} from "@angular/core";
import { Router } from "@angular/router";
import { DetailsStore } from "./detail.store";

@Component({
  selector: "app-details",
  template: `
    <ng-container *ngIf="vm$ | async as vm">
      <ng-template #pokemonContents>
        <div
          class="relative flex flex-col w-[360px] h-[640px] mx-auto bg-green-500 rounded-xl p-1"
        >
          <img
            class="absolute top-0 right-0 m-2 select-none"
            src="/assets/images/Pokeball.png"
          />
          <header class="flex items-center gap-4 p-5 z-10">
            <img
              routerLink="/pokemons"
              src="/assets/images/back-icon.png"
              class="cursor-pointer"
            />
            <h3 class="text-2xl text-white font-bold capitalize">
              {{ vm.pokemon.name }}
            </h3>
            <span class="text-white ml-auto"
              >#{{ vm.id.padStart(3, "0") }}</span
            >
          </header>
          <div class="z-10 flex items-end justify-between mx-6 mb-4">
            <img
              (click)="goPrev()"
              src="/assets/images/arrow-left.png"
              class="cursor-pointer"
            />
            <img
              [src]="vm.pokemon.image"
              alt=""
              class="w-[200px] h-[200px] mx-auto mb-[-70px]"
            />
            <img
              (click)="goNext()"
              src="/assets/images/arrow-right.png"
              class="cursor-pointer"
            />
          </div>
          <div
            class="h-[412px] bg-white mt-auto rounded-lg px-5 pt-14 flex flex-col items-center gap-4"
          >
            <div class="flex gap-4">
              <span
                class="text-xs font-bold text-white bg-green-600 px-2 py-[2px] rounded-full"
                >{{ vm.pokemon.type }}</span
              >
            </div>
            <p class="text-orange-400 font-bold">About</p>
            <div class="w-full flex items-center justify-between">
              <div class="text-center py-2 px-6">
                <div class="flex items-center gap-2 mb-2">
                  <img src="/assets/images/scale.png" alt="" />
                  <p class="text-[10px]">8,5kg</p>
                </div>
                <p class="text-[8px]">Weight</p>
              </div>
              <div class="text-center py-2 px-6 border-x">
                <div class="flex items-center gap-2 mb-2">
                  <img src="/assets/images/ruler.png" alt="" />
                  <p class="text-[10px]">0,6m</p>
                </div>
                <p class="text-[8px]">Height</p>
              </div>
              <div class="text-center py-2 px-6">
                <p class="text-[10px] truncate">
                  {{ vm.pokemon.hiddenAbility }}
                </p>
                <p class="text-[10px]">{{ vm.pokemon.ability }}</p>
                <p class="text-[8px]">Moves</p>
              </div>
            </div>
            <a
              [href]="vm.pokemon.image"
              target="_blank"
              class="text-[10px] w-full line-clamp-2"
            >
              {{ vm.pokemon.image }}
            </a>
            <p class="text-orange-400 font-bold">Base stats</p>
            <div class="w-full flex gap-2">
              <ul class="text-[10px] font-bold text-orange-400">
                <li *ngFor="let stat of vm.pokemon.stats">
                  <p class="text-right h-4 uppercase">{{ stat.stat.name }}</p>
                </li>
              </ul>
              <ul class="flex-1">
                <li
                  class=" flex items-center gap-2 text-[10px] font-bold text-orange-400"
                  *ngFor="let stat of vm.pokemon.stats"
                >
                  <div class="w-[1px] h-4 bg-gray-300"></div>
                  <p>{{ (stat.base_stat + "").padStart(3, "0") }}</p>
                  <div class="flex-1 h-1 bg-gray-200">
                    <div
                      [style.width.%]="(stat.base_stat / 255) * 100"
                      class="h-full bg-orange-400 w-1/"
                    ></div>
                  </div>
                </li>
              </ul>
            </div>
          </div></div
      ></ng-template>
      <div class="loading-block" *ngIf="vm.isLoading; else pokemonContents">
        <p>loading...</p>
      </div>
      <!-- <code>{{ vm | json }}</code> -->
    </ng-container>
  `,
  styles: [],
  providers: [DetailsStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailsComponent implements OnInit {
  @HostBinding("class") get hostClass() {
    return "mt-6 block";
  }
  vm$ = this.detailsStore.vm$;
  constructor(private detailsStore: DetailsStore, private router: Router) {}

  ngOnInit(): void {}

  goNext() {
    this.detailsStore.nextIdEffect();
  }
  goPrev() {
    this.detailsStore.prevIdEffect();
  }
}
