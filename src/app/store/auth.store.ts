import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { ComponentStore } from "@ngrx/component-store";
import { tap } from "rxjs";
import { User } from "../models/user";

export interface AuthState {
  user: User;
}

@Injectable({ providedIn: "root" })
export class AuthStore extends ComponentStore<AuthState> {
  user$ = this.select((s) => s.user);
  vm$ = this.select((s) => ({ user: s.user, isLoggedIn: !!s.user }));
  constructor(private router: Router) {
    super({ user: null });
    this.initializeEffect();
    this.saveUserEffect(this.user$);
  }
  initializeEffect = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        const user = localStorage.getItem("user")
          ? JSON.parse(localStorage.getItem("user"))
          : null;
        if (user) this.patchState({ user });
      })
    )
  );

  saveUserEffect = this.effect<User>((user$) =>
    user$.pipe(
      tap((user) => {
        if (user) localStorage.setItem("user", JSON.stringify(user));
        else localStorage.removeItem("user");
      })
    )
  );

  loginEffect = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        this.patchState({ user: { name: "Hieu", likes: 0, dislikes: 0 } });
        this.router.navigate(["/pokemons"]);
      })
    )
  );

  logoutEffect = this.effect((trigger$) =>
    trigger$.pipe(
      tap(() => {
        console.log(`logout effect`);
        this.patchState({ user: null });
        this.router.navigate(["/not-auth"]);
      })
    )
  );

  like = this.updater((state) => ({
    ...state,
    user: { ...state.user, likes: state.user.likes + 1 },
  }));

  disLike = this.updater((state) => ({
    ...state,
    user: { ...state.user, dislikes: state.user.dislikes + 1 },
  }));
}
