import { Component, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";
import { take, tap } from "rxjs";
import { AppContextService } from "src/app/services/app-context.service";
import { AuthStore } from "src/app/store/auth.store";

@Component({
  selector: "app-navbar",
  template: `
    <div
      class="flex items-center justify-between gap-2 bg-gray-200 dark:bg-slate-700 px-4 py-2 dark:text-gray-200"
    >
      <!-- <h2>Pokemon angular</h2> -->
      <label
        for="toggle"
        class="w-12 h-7 bg-gray-300 dark:bg-slate-800 border border-gray-400 dark:border-gray-600 rounded-full flex items-center px-[1px] shrink-0"
      >
        <ng-container>
          <div
            [class.translate-x-5]="toggleDarkMode.value"
            class="h-6 w-6 rounded-full bg-white dark:bg-slate-500 border dark:border-slate-600 transition-transform flex items-center justify-center"
          >
            <span
              [class]="
                toggleDarkMode.value
                  ? ['ion-ios-moon', 'text-yellow-400']
                  : ['ion-ios-sunny', 'text-yellow-600']
              "
              class="text-lg  ion"
            ></span>
          </div>
        </ng-container>
        <input
          type="checkbox"
          id="toggle"
          [formControl]="toggleDarkMode"
          class="hidden"
        />
      </label>
      <ng-container *ngIf="vm$ | async as vm">
        <ng-container *ngIf="vm.isLoggedIn; else loginBlock">
          <p class="text-sm text-center">
            I'm {{ vm.user?.name }}. I like {{ vm.user?.likes }} and dislike
            {{ vm.user?.dislikes }} pokemons
          </p>
          <button class="btn btn-primary" (click)="logout()">
            <span class="hidden md:inline">Logout</span>
            <span class="md:hidden">
              <span class="ion ion-md-log-out text-2xl"></span>
            </span>
          </button>
        </ng-container>
        <ng-template #loginBlock>
          <button class="btn btn-primary" (click)="login()">login</button>
        </ng-template>
      </ng-container>
    </div>
  `,
  styles: [
    `
      .navbar {
        &-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #eee;
          padding: 1rem;
        }
      }
    `,
  ],
})
export class NavbarComponent implements OnInit {
  vm$ = this.auth.vm$;
  toggleDarkMode = new FormControl();

  constructor(private auth: AuthStore, private appContext: AppContextService) {
    this.appContext.isDarkMode$
      .pipe(take(1))
      .subscribe((isDarkMode) => this.toggleDarkMode.patchValue(isDarkMode));

    this.toggleDarkMode.valueChanges
      .pipe(
        tap((isToggle) => {
          localStorage.setItem("theme", isToggle ? "dark" : "light");
          this.appContext.setDarkMode(isToggle);
        })
      )
      .subscribe(() => {});
  }

  ngOnInit(): void {}

  login() {
    this.auth.loginEffect();
  }
  logout() {
    this.auth.logoutEffect();
  }
}
