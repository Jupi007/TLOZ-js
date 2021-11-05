export namespace Random {
  export function getIntInclusive(min: number, max: number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  export function getOneInt(number: number): boolean {
    return getIntInclusive(1, number) === 1;
  }
}
