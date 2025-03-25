export {};

declare global {
  type Fn<I, O> = (x: I) => O;
  type FnOrConst<I, O> = O | Fn<I, O>;
  type Predicate<I> = (x: I) => boolean;
  type PredicateOrConst<I> = I | Predicate<I>;
}
