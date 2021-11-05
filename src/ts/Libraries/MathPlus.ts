export namespace MathPlus {
  export function trunc(number: number, nbDecimals: number = 0) {
    nbDecimals = Math.trunc(nbDecimals);

    return Math.trunc(number * 10 ** nbDecimals) / 10 ** nbDecimals;
  }

  export function round(number: number, nbDecimals: number = 0) {
    nbDecimals = Math.trunc(nbDecimals);

    return Math.round(number * 10 ** nbDecimals) / 10 ** nbDecimals;
  }
}
