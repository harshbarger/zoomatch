import { describe, expect, it } from "vitest";
import { asIs, match } from "../src/index";

const isPositive = (x: number) => x > 0;
const isEven = (x: number) => x % 2 === 0;
const isDivisibleByThree = (x: number) => x % 3 === 0;
const first = (x: number[]) => x[0] || NaN;

const double = (x: number) => x * 2;
const addFive = (x: number) => x + 5;

describe("match with argument", () => {
  it("handles equality to primitives with when", () => {
    expect(
      match(10).when(10, double).when(0, addFive).otherwise(-2)
    ).toBe(20);
    expect(
      match(0).when(10, double).when(0, addFive).otherwise(-2)
    ).toBe(5);
    expect(
      match(100).when(10, double).when(0, addFive).otherwise(-2)
    ).toBe(-2);
    expect(match(10).when(10, 5).when(0, 100).otherwise(double)).toBe(
      5
    );
    expect(match(0).when(10, 5).when(0, 100).otherwise(double)).toBe(
      100
    );
    expect(
      match(100).when(10, 5).when(0, 100).otherwise(double)
    ).toBe(200);
  });

  it("handles passsng predicates with when", () => {
    expect(match(10).when(isPositive, double).otherwise(-2)).toBe(20);
    expect(match(0).when(isPositive, double).otherwise(-2)).toBe(-2);
    expect(match(10).when(isPositive, 5).otherwise(double)).toBe(5);
    expect(match(-10).when(isPositive, 5).otherwise(double)).toBe(
      -20
    );
  });

  it("handles multiple conditions with whenAny", () => {
    expect(
      match(10)
        .whenAny([isPositive, isEven, -5], double)
        .otherwise(-2)
    ).toBe(20);
    expect(
      match(5).whenAny([isPositive, isEven, -5], double).otherwise(-2)
    ).toBe(10);
    expect(
      match(-10)
        .whenAny([isPositive, isEven, -5], double)
        .otherwise(-2)
    ).toBe(-20);
    expect(
      match(-5)
        .whenAny([isPositive, isEven, -5], double)
        .otherwise(-2)
    ).toBe(-10);
    expect(
      match(-7)
        .whenAny([isPositive, isEven, -5], double)
        .otherwise(-2)
    ).toBe(-2);
  });

  it("handles multiple conditions with whenAll", () => {
    expect(
      match(10)
        .whenAll([isPositive, isEven, isDivisibleByThree], double)
        .otherwise(-2)
    ).toBe(-2);
    expect(
      match(-6)
        .whenAll([isPositive, isEven, isDivisibleByThree], double)
        .otherwise(-2)
    ).toBe(-2);
    expect(
      match(9)
        .whenAll([isPositive, isEven, isDivisibleByThree], double)
        .otherwise(-2)
    ).toBe(-2);
    expect(
      match(6)
        .whenAll([isPositive, isEven, isDivisibleByThree], double)
        .otherwise(-2)
    ).toBe(12);
  });

  it("handles multiple conditions with whenNone", () => {
    expect(
      match(1)
        .whenNone([-3, isPositive, isEven], double)
        .otherwise(-2)
    ).toBe(-2);
    expect(
      match(-4)
        .whenNone([-3, isPositive, isEven], double)
        .otherwise(-2)
    ).toBe(-2);
    expect(
      match(-3)
        .whenNone([-3, isPositive, isEven], double)
        .otherwise(-2)
    ).toBe(-2);
    expect(
      match(-5)
        .whenNone([-3, isPositive, isEven], double)
        .otherwise(-2)
    ).toBe(-10);
  });

  it("handles empty arrays of conditions logically", () => {
    expect(match(1).whenNone([], 10).otherwise(-2)).toBe(10);
    expect(match(1).whenAny([], 10).otherwise(-2)).toBe(-2);
    expect(match(1).whenAll([], 10).otherwise(-2)).toBe(10);
  });

  it("handles whenWithFn", () => {
    expect(
      match([3, 4])
        .whenWithFn(first, isPositive, double)
        .otherwise(-2)
    ).toBe(6);
    expect(
      match([-3, 4])
        .whenWithFn(first, isPositive, double)
        .otherwise(-2)
    ).toBe(-2);
    expect(
      match([3, 4]).whenWithFn(first, 3, double).otherwise(-2)
    ).toBe(6);
    expect(
      match([4, 3]).whenWithFn(first, 3, double).otherwise(-2)
    ).toBe(-2);
  });

  it("works with asIs", () => {
    expect(match(1).when(isPositive, asIs).otherwise(-2)).toBe(1);
    expect(
      match("pig")
        .whenWithFn((x) => x.length, isPositive, asIs)
        .otherwise(-2)
    ).toBe(3);
  });
});

describe("match without argument", () => {
  it("handles expression comparisons with when", () => {
    const a = -4;
    const b = -2;

    let x = -4;
    let y = -2;
    let z = 0;

    expect(
      match()
        .when(x === a, 10)
        .when(x === b, 100)
        .otherwise(5)
    ).toBe(10);

    expect(
      match()
        .when(y === a, 10)
        .when(y === b, 100)
        .otherwise(5)
    ).toBe(100);

    expect(
      match()
        .when(z === a, 10)
        .when(z === b, 100)
        .otherwise(5)
    ).toBe(5);
  });

  it("handles multiple conditions with whenAny", () => {
    let x = 4;
    let y = 6;
    let z = 10;

    expect(
      match()
        .whenAny([x === 4, y === 4, z === 4], 100)
        .otherwise(0)
    ).toBe(100);

    expect(
      match()
        .whenAny([x > 17, y > 17, z > 17], 100)
        .otherwise(0)
    ).toBe(0);
  });

  it("handles multiple conditions with whenAll", () => {
    let x = 4;
    let y = 6;
    let z = 10;

    expect(
      match()
        .whenAll([x > 2, y > 2, z > 2], 100)
        .otherwise(0)
    ).toBe(100);

    expect(
      match()
        .whenAll([x > 5, y > 5, z > 5], 100)
        .otherwise(0)
    ).toBe(0);
  });

  it("handles multiple conditions with whenNone", () => {
    let x = 4;
    let y = 6;
    let z = 10;

    expect(
      match()
        .whenNone([x > 12, y > 12, z > 12], 100)
        .otherwise(0)
    ).toBe(100);

    expect(
      match()
        .whenNone([x > 7, y > 7, z > 7], 100)
        .otherwise(0)
    ).toBe(0);
  });

  it("handles empty arrays of conditions logically", () => {
    expect(match().whenNone([], 10).otherwise(-2)).toBe(10);
    expect(match().whenAny([], 10).otherwise(-2)).toBe(-2);
    expect(match().whenAll([], 10).otherwise(-2)).toBe(10);
  });
});
