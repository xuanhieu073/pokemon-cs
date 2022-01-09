import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "oneLineNormalText",
})
export class OneLineNormalTextPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    console.log(value);
    const result = value
      ? (value as string).replace(/[^A-Za-z0-9.&,]/g, " ")
      : "";
    console.log({ result });
    return result;
    // return null;
  }
}
