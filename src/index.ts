import { Match } from "./Match";
import { MatchNoArg } from "./MatchNoArg";

export function match<T, U>(): MatchNoArg<U>;
export function match<T, U>(value: T): Match<T, U>;
export function match<T, U>(value?: T): Match<T, U> | MatchNoArg<U> {
  return value === undefined
    ? new MatchNoArg<U>()
    : new Match<T, U>(value);
}

export function asIs<T>(value: T): T {
  return value;
}
