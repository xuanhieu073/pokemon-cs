import { Component } from "@angular/core";

@Component({
  selector: "app-root",
  template: `
    <div class="dark">
      <div class="dark:bg-slate-800 h-screen overflow-y-scroll">
        <app-navbar></app-navbar>
        <router-outlet></router-outlet>
      </div>
    </div>
  `,
  styles: [],
})
export class AppComponent {
  title = "pokemon-cs";
}
