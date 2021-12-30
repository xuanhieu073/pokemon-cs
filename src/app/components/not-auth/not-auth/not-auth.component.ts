import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-not-auth",
  template: `
    <div class="container">
      <p>please login</p>
    </div>
  `,
  styles: [
    `
      .container {
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
      }
    `,
  ],
})
export class NotAuthComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
