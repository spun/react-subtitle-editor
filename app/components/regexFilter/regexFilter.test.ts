import { describe, expect, test } from "vitest"
import { splitByMatches } from "./regexFilter"

describe('splitByMatches', () => {
  test('adds 1 + 2 to equal 3', () => {
    // ---CCCCCAAA-----------CCCCCAAA------ (where C is A + B)
    const line = "---CCCCCAAA-----------CCCCCAAA------"
    const matches = [
      { start: 3, end: 8, types: ['A', 'B'] },
      { start: 8, end: 11, types: ['A'] },
      { start: 22, end: 27, types: ['A', 'B'] },
      { start: 27, end: 30, types: ['A'] }
    ]
    const result = splitByMatches(line, matches)
    expect(result).toEqual([
      { "text": "---", "types": null, },
      { "text": "CCCCC", "types": ["A", "B",], },
      { "text": "AAA", "types": ["A",], },
      { "text": "-----------", "types": null, },
      { "text": "CCCCC", "types": ["A", "B",], },
      { "text": "AAA", "types": ["A",], },
      { "text": "------", "types": null, },
    ])
  })
})