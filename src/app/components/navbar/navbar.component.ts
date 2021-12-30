import { Component, OnInit } from "@angular/core";
import { AuthStore } from "src/app/store/auth.store";

@Component({
  selector: "app-navbar",
  template: `
    <div class="navbar-header">
      <h2>Pokemon angular</h2>
      <ng-container *ngIf="vm$ | async as vm">
        <ng-container *ngIf="vm.isLoggedIn; else loginBlock">
          <p>
            I'm {{ vm.user?.name }}. I like {{ vm.user?.likes }} and dislike
            {{ vm.user?.dislikes }} pokemons
          </p>
          <button class="btn btn-primary" (click)="logout()">Logout</button>
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
  constructor(private auth: AuthStore) {}

  ngOnInit(): void {}

  login() {
    this.auth.loginEffect();
  }
  logout() {
    this.auth.logoutEffect();
  }
}
