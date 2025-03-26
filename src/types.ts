export type Fn<I, O> = (x: I) => O;
export type FnOrConst<I, O> = O | Fn<I, O>;
export type Predicate<I> = (x: I) => boolean;
export type PredicateOrConst<I> = I | Predicate<I>;

// Vscode seemed to find types just find with declare global and export {}, but tsup build doesn't work with it.
// TODO: figure out why declare global doesn't work
