# Zoomatch

Zoomatch is a small pattern matching class written in Typescript. It draws inspiration from the excellent [ts-pattern](https://github.com/gvergnaud/ts-pattern), though the two have rather different APIs. Zoomatch will probably be more convenient for matching primitives, while ts-pattern has more features for working with objects.

## Installation

```bash
npm install zoomatch
```

## Basic Usage

`match` is a factory function that returns an instance of `Match<T, U>`. `T` is the type of the value being matched, and `U` is the type of the result.

```ts
import { match } from "zoomatch";

function getWaterPhase(temperatureC: number): "solid" | "liquid" | "gas" {
  return match(temperature)
    .when((x) => x < 0, "solid")
    .when((x) => x > 100, "gas")
    .otherwise("liquid");
}

getWaterPhase(40); // "liquid"
getWaterPhase(120); // "gas"
getWaterPhase(-20); // "solid"
```

The last method must always be `otherwise`. The `when` method returns not the result itself, but another `Match` instance. Only the `otherwise` method returns the actual result.

You may also use functions of the matched value rather than constants for the result.

```ts
function calculateTotalCost(units: number): number {
  return match(units)
    .when(
      (x) => x >= 1000,
      (x) => x * 2
    )
    .when(
      (x) => x >= 500,
      (x) => x * 2.5
    )
    .otherwise((x) => x * 3);
}

calculateTotalCost(2000); // 2000 * 2 = 4000
calculateTotalCost(700); // 700 * 2.5 = 1750
calculateTotalCost(300); // 300 * 3 = 900
```

Notice that the order of conditions matters in the example above. Zoomatch stops looking after the first match
it finds, so `calculateTotalCost(2000)` returned the result from the first `when` method, even though the following
condition was also true.

## Other Matching Techniques

The predicates of the `when` function (and most of its variants described below) can be either boolean function or constants. Using a constant is a convenience shortcut, where `CONSTANT` is equivalent to `(x) => x === CONSTANT`.

```ts
const classification = match(legs)
  .when(4, "quadriped")
  .when(8, "arachnid")
  .when(2, "biped")
  .when((x) => x > 8, "scary bug")
  .otherwise("unknown");
```

There are convenience methods for matching any, none, or all of a set of conditions. These methods accept an array
of conditions as the first parameter. The `whenAny` and `whenNone` methods can use constants and/or boolean functions as the conditions, just as the basic `when` method does. The `whenAll` method, however, accepts only boolean functions since including constants would presumably be a logic error.

```ts
const triangle = match<{A: number, B: number: C:number}, string>(angles)
  .when((a) => a.A + a.B + a.C !== 180, "not a triangle")
  .whenAny([(a) => a.A === 90, (a) => a.B === 90, (a) => a.C === 90], 'right')
  .whenNone([(a) => a.A === a.B, (a) => a.B === a.C, (a) => a.A === a.C], 'scalene')
  .whenAll([(a) => a.A === 60, (a) => a.B === 60, (a) => a.C === 60], 'equilateral')
  .otherwise("isosceles");
```

## The `asIs` Function

When the result is the same as the original value (or the intermediate value for `wheWithFn`), you can use the covnenience function `asIs` instead of `(x) => x`.

```ts
import { match, asIs } from "zoomatch";

function clamp(x, min, max): number {
  return match(x)
    .when((x) => x < min, min)
    .when((x) => x > max, max)
    .otherwise(asIs);
}
match(number);

clamp(5, 0, 100); // 5
clamp(500, 0, 100); // 100
clamp(-5, 0, 100); // 0
```

## Transformations with `whenWithFn`

The `whenWithFn` method applies function `fn` (specified in the first argument) and uses its output both to evaluate the condition and to calculate the result. This can allow for some less repetitive code, and also removes the need to perform potentially expensive operations twice.

```ts
// assume that a function sum exists to sum the array elements
function tablesNeeded(groupSizes: number[]): string {
  return match(groupSizes)
    .whenWithFn(
      sum,
      (s) => s > 100,
      (s) => `The fire marshall will not allow ${s} people.`
    )
    .whenWithFn(
      sum,
      (s) => s > 0,
      (s) => `${Math.ceil(s / 10)} tables needed`
    )
    .otherwise("Sorry, nobody is coming.");
}

tablesNeeded([20, 30, 10, 50]); // 'The firs marshall will not allow 110 people'
tablesNeeded([10, 10, 25]); // '5 tables needed'
```

## License

MIT
