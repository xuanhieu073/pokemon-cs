import { Injectable } from "@angular/core";
import { CanLoad, Route, Router, UrlSegment, UrlTree } from "@angular/router";
import { map, Observable, tap } from "rxjs";
import { AuthStore } from "../store/auth.store";

@Injectable({
  providedIn: "root",
})
export class PokemonsGuard implements CanLoad {
  constructor(private auth: AuthStore, private router: Router) {}
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> {
    return this.auth.vm$.pipe(
      map((s) => s.isLoggedIn),
      tap((isLoggedIn) => {
        if (!isLoggedIn) this.router.navigate(["/not-auth"]);
      })
    );
  }
}
