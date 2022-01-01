import { Component } from "@angular/core";
import { Observable } from "rxjs";
import { AppContextService } from "./services/app-context.service";

@Component({
  selector: "app-root",
  template: `
    <ng-container *ngIf="{ isDarkMode: isDarkMode$ | async } as theme">
      <div [class.dark]="theme.isDarkMode">
        <div class="dark:bg-slate-800 h-screen overflow-y-scroll">
          <app-navbar></app-navbar>
          <router-outlet></router-outlet>
        </div>
      </div>
    </ng-container>
  `,
  styles: [],
})
export class AppComponent {
  isDarkMode$: Observable<boolean>;
  constructor(private appContext: AppContextService) {
    const theme = localStorage.getItem("theme") as string;
    if (theme && theme === "dark") {
      this.appContext.setDarkMode(true);
    }
    this.isDarkMode$ = this.appContext.isDarkMode$;
  }
}
