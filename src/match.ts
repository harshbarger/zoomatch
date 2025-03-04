type Fn<I, O> = (x: I) => O;
type FnOrConst<I, O> = O | Fn<I, O>;
type Predicate<I> = (x: I) => boolean;
type PredicateOrConst<I> = I | Predicate<I>;

const NO_MATCH_YET = Symbol("no match yet");

class Match<T, U = T> {
  #value: T;
  #result: U | typeof NO_MATCH_YET = NO_MATCH_YET;
  constructor(value: T) {
    this.#value = value;
    this.#result = NO_MATCH_YET;
  }

  #doTransform<U>(transform: FnOrConst<T, U>) {
    return transform instanceof Function ? transform(this.#value) : transform;
  }

  #isPassing(condition: PredicateOrConst<T>): boolean {
    return condition instanceof Function
      ? condition(this.#value)
      : condition === this.#value;
  }

  #noMatchYet() {
    return this.#result === NO_MATCH_YET;
  }

  when(
    condition: PredicateOrConst<T>,
    transform: FnOrConst<T, U>
  ): Match<T, U> {
    if (this.#noMatchYet()) {
      if (this.#isPassing(condition)) {
        this.#result = this.#doTransform(transform);
      }
    }

    return this;
  }

  whenAny(
    conditions: PredicateOrConst<T>[],
    transform: FnOrConst<T, U>
  ): Match<T, U> {
    if (this.#noMatchYet()) {
      if (conditions.some((c) => this.#isPassing(c))) {
        this.#result = this.#doTransform(transform);
      }
    }

    return this;
  }

  // constants not allowed for predicate since this would likely be a logic error
  whenAll(conditions: Predicate<T>[], transform: FnOrConst<T, U>): Match<T, U> {
    if (this.#noMatchYet()) {
      if (conditions.every((c) => this.#isPassing(c))) {
        this.#result = this.#doTransform(transform);
      }
    }

    return this;
  }

  whenNone(
    conditions: PredicateOrConst<T>[],
    transform: FnOrConst<T, U>
  ): Match<T, U> {
    if (this.#noMatchYet()) {
      if (conditions.every((c) => !this.#isPassing(c))) {
        this.#result = this.#doTransform(transform);
      }
    }

    return this;
  }

  otherwise(transform: FnOrConst<T, U>): U {
    if (this.#noMatchYet()) {
      this.#result = this.#doTransform(transform);
    }

    return this.#result as U;
  }
}

export function match<T, U = T>(value: T): Match<T, U> {
  return new Match<T, U>(value);
}
