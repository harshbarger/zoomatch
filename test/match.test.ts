import { describe, expect, it } from "vitest";
import { match } from "../src/match";

const isPositive = (x: number) => x > 0;
const isEven = (x: number) => x % 2 === 0;
const isDivisibleByThree = (x: number) => x % 3 === 0;

const double = (x: number) => x * 2;
const addFive = (x: number) => x + 5;

describe("match", () => {
  it("handles equality to primitives with when", () => {
    expect(match(10).when(10, double).when(0, addFive).otherwise(-2)).toBe(20);
    expect(match(0).when(10, double).when(0, addFive).otherwise(-2)).toBe(5);
    expect(match(100).when(10, double).when(0, addFive).otherwise(-2)).toBe(-2);
    expect(match(10).when(10, 5).when(0, 100).otherwise(double)).toBe(5);
    expect(match(0).when(10, 5).when(0, 100).otherwise(double)).toBe(100);
    expect(match(100).when(10, 5).when(0, 100).otherwise(double)).toBe(200);
  });

  it("handles passsng predicates with when", () => {
    expect(match(10).when(isPositive, double).otherwise(-2)).toBe(20);
    expect(match(0).when(isPositive, double).otherwise(-2)).toBe(-2);
    expect(match(10).when(isPositive, 5).otherwise(double)).toBe(5);
    expect(match(-10).when(isPositive, 5).otherwise(double)).toBe(-20);
  });

  it("handles multiple conditions with whenAny", () => {
    expect(
      match(10).whenAny([isPositive, isEven, -5], double).otherwise(-2)
    ).toBe(20);
    expect(
      match(5).whenAny([isPositive, isEven, -5], double).otherwise(-2)
    ).toBe(10);
    expect(
      match(-10).whenAny([isPositive, isEven, -5], double).otherwise(-2)
    ).toBe(-20);
    expect(
      match(-5).whenAny([isPositive, isEven, -5], double).otherwise(-2)
    ).toBe(-10);
    expect(
      match(-7).whenAny([isPositive, isEven, -5], double).otherwise(-2)
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
      match(1).whenNone([-3, isPositive, isEven], double).otherwise(-2)
    ).toBe(-2);
    expect(
      match(-4).whenNone([-3, isPositive, isEven], double).otherwise(-2)
    ).toBe(-2);
    expect(
      match(-3).whenNone([-3, isPositive, isEven], double).otherwise(-2)
    ).toBe(-2);
    expect(
      match(-5).whenNone([-3, isPositive, isEven], double).otherwise(-2)
    ).toBe(-10);
  });

  it("handles empty arrays of conditions logically", () => {
    expect(match(1).whenNone([], 10).otherwise(-2)).toBe(10);
    expect(match(1).whenAny([], 10).otherwise(-2)).toBe(-2);
    expect(match(1).whenAll([], 10).otherwise(-2)).toBe(10);
  });
});
