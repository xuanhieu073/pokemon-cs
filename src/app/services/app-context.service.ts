import { Injectable } from "@angular/core";
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  startWith,
  tap,
} from "rxjs";

@Injectable({ providedIn: "root" })
export class AppContextService {
  readonly isDarkMode$: Observable<boolean>;
  private isDarkModeSubject = new BehaviorSubject<boolean>(false);
  constructor() {
    this.isDarkMode$ = this.isDarkModeSubject.asObservable();
    // .pipe(startWith(false));
  }

  setDarkMode(isDarkMode: boolean) {
    this.isDarkModeSubject.next(isDarkMode);
  }
}
