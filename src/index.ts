import { Match } from "./Match";
import { MatchNoArg } from "./MatchNoArg";

export function match<T, U>(): MatchNoArg<U>;
export function match<T, U>(value: T): Match<T, U>;
export function match<T, U>(value?: T): Match<T, U> | MatchNoArg<U> {
  return arguments.length === 0
    ? new MatchNoArg<U>()
    : new Match<T, U>(value as T);
}

export function asIs<T>(value: T): T {
  return value;
}
