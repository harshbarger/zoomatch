import { NO_MATCH_YET } from "./Match";
export class MatchNoArg<U> {
  #result: U | typeof NO_MATCH_YET = NO_MATCH_YET;

  constructor() {
    this.#result = NO_MATCH_YET;
  }

  #noMatchYet() {
    return this.#result === NO_MATCH_YET;
  }

  when(condition: boolean, result: U): MatchNoArg<U> {
    if (this.#noMatchYet()) {
      if (condition) {
        this.#result = result;
      }
    }

    return this;
  }

  whenAny(conditions: boolean[], result: U): MatchNoArg<U> {
    if (this.#noMatchYet()) {
      if (conditions.some((c) => c)) {
        this.#result = result;
      }
    }

    return this;
  }

  whenAll(conditions: boolean[], result: U): MatchNoArg<U> {
    if (this.#noMatchYet()) {
      if (conditions.every((c) => c)) {
        this.#result = result;
      }
    }

    return this;
  }

  whenNone(conditions: boolean[], result: U): MatchNoArg<U> {
    if (this.#noMatchYet()) {
      if (conditions.every((c) => !c)) {
        this.#result = result;
      }
    }

    return this;
  }

  otherwise(result: U): U {
    return this.#noMatchYet() ? result : (this.#result as U);
  }
}
