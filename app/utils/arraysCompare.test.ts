import { describe, expect, test } from "vitest"
import { arraysHaveSameElements } from "./arraysCompare"

describe('arraysHaveSameElements', () => {

  test("same items, same position", () => {
    const one = ['A', 'B']
    const two = ['A', 'B']
    const result = arraysHaveSameElements(one, two)
    expect(result).toBeTruthy()
  })

  test("same items, different position", () => {
    const one = ['A', 'B']
    const two = ['B', 'A']
    const result = arraysHaveSameElements(one, two)
    expect(result).toBeTruthy()
  })

  test("different length", () => {
    const one = ['A', 'B']
    const two = ['A', 'B', 'C']
    const resultOne = arraysHaveSameElements(one, two)
    expect(resultOne).toBeFalsy()
    // Also test when first array is longer
    const resultTwo = arraysHaveSameElements(two, one)
    expect(resultTwo).toBeFalsy()
  })

  test("empty arrays are equal", () => {
    const one: string[] = []
    const two: string[] = []
    const result = arraysHaveSameElements(one, two)
    expect(result).toBeTruthy()
  })
})
