import { Match } from "./match";
export function match<T, U>(value: T): Match<T, U> {
  return new Match<T, U>(value);
}

export function asIs<T>(value: T): T {
  return value;
}
