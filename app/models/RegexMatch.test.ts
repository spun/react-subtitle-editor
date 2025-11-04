import { describe, expect, test } from 'vitest'
import { getRegexMatches, mergeRegexMatches, mergeRegexMatchesWithAnnotation, type RegexMatch } from './RegexMatch'

describe('getRegexMatches', () => {
  test('can find matches using regex', () => {
    const text = "My house is red. Your house is blue."
    const regex = /house/g

    const matches = getRegexMatches(text, regex)
    expect(matches).toEqual([{ start: 3, end: 8 }, { start: 22, end: 27 }])
  })
})


describe('mergeRegexMatches', () => {
  test('merge matches from different lists', () => {
    //   A: ---AAAAAAAA------AAAAA---AA---
    //   B: ---AAAA-------AAAA---------AA-
    // Res: ---AAAAAAAA---AAAAAAAA---AAAA-
    const a: RegexMatch[] = [{ start: 3, end: 11 }, { start: 17, end: 22 }, { start: 25, end: 27 }]
    const b: RegexMatch[] = [{ start: 3, end: 7 }, { start: 14, end: 18 }, { start: 27, end: 29 }]
    const result = mergeRegexMatches(a, b)
    expect(result).toEqual([
      { start: 3, end: 11 },
      { start: 14, end: 22 },
      { start: 25, end: 29 },
    ])
  })

  test('merge matches from different lists. unsorted', () => {
    const a: RegexMatch[] = [{ start: 17, end: 22 }, { start: 25, end: 27 }, { start: 3, end: 11 }]
    const b: RegexMatch[] = [{ start: 27, end: 29 }, { start: 14, end: 18 }, { start: 3, end: 7 }]
    const result = mergeRegexMatches(a, b)
    expect(result).toEqual([
      { start: 3, end: 11 },
      { start: 14, end: 22 },
      { start: 25, end: 29 },
    ])
  })

  test('merge near matches of the same type', () => {
    // A: ---AAAAAAAA-----------AAAAAAAA------
    // B: ---BBBBB--------------BBBBB---------
    // R: ---CCCCCAAA-----------CCCCCAAA------ (where C is A + B)
    const a: RegexMatch[] = [{ start: 3, end: 11 }, { start: 11, end: 14 }]
    const b: RegexMatch[] = []
    const result = mergeRegexMatchesWithAnnotation(
      { label: 'A', matches: a },
      { label: 'B', matches: b }
    )
    expect(result).toEqual([{ start: 3, end: 14, types: ['A'] }])
  })
})


describe('mergeRegexMatchesWithAnnotation', () => {
  test('merge example from function documentation', () => {
    // A: ---AAAAAAAA-----------AAAAAAAA------
    // B: ---BBBBB-------------BBBBBB---------
    // R: ---CCCCCAAA----------BCCCCCAAA------ (where C is A + B)
    const a: RegexMatch[] = [{ start: 3, end: 11 }, { start: 22, end: 30 }]
    const b: RegexMatch[] = [{ start: 3, end: 8 }, { start: 21, end: 27 }]
    const result = mergeRegexMatchesWithAnnotation(
      { label: 'A', matches: a },
      { label: 'B', matches: b }
    )
    expect(result).toEqual([
      { start: 3, end: 8, types: ['A', 'B'] },
      { start: 8, end: 11, types: ['A'] },
      { start: 21, end: 22, types: ['B'] },
      { start: 22, end: 27, types: ['A', 'B'] },
      { start: 27, end: 30, types: ['A'] }
    ])
  })

  test('merge near matches of the same type in the same array', () => {
    // A: ---AAAA|AAAA------AAAAAAAA------
    // B: ---BBBB|BBBB-----BBBBB----------
    // R: ---CCCC CCCC-----BCCCCAAAA------ (where C is A + B)
    const a: RegexMatch[] = [{ start: 3, end: 7 }, { start: 7, end: 11 }, { start: 17, end: 25 }]
    const b: RegexMatch[] = [{ start: 3, end: 7 }, { start: 7, end: 11 }, { start: 16, end: 21 }]
    const result = mergeRegexMatchesWithAnnotation(
      { label: 'A', matches: a },
      { label: 'B', matches: b }
    )
    expect(result).toEqual([
      { start: 3, end: 11, types: ['A', 'B'] },
      { start: 16, end: 17, types: ['B'] },
      { start: 17, end: 21, types: ['A', 'B'] },
      { start: 21, end: 25, types: ['A'] }
    ])
  })

  test('merge near matches of the same type in the same array', () => {
    const a: RegexMatch[] = [{ start: 3, end: 11 }, { start: 11, end: 14 }]
    const b: RegexMatch[] = []
    const result = mergeRegexMatchesWithAnnotation(
      { label: 'A', matches: a },
      { label: 'B', matches: b }
    )
    expect(result).toEqual([{ start: 3, end: 14, types: ['A'] }])
  })

  test('merge empty matches', () => {
    const a: RegexMatch[] = []
    const b: RegexMatch[] = []
    const result = mergeRegexMatchesWithAnnotation(
      { label: 'A', matches: a },
      { label: 'B', matches: b }
    )
    expect(result).toEqual([])
  })

  test('merge N lists of matches', () => {
    // A: --AAA---A------
    // B: ---BBB---B-----
    // C: ----CCC----C---
    // D: -----DDD----D--
    const a: RegexMatch[] = [{ start: 2, end: 5 }, { start: 8, end: 9 }]
    const b: RegexMatch[] = [{ start: 3, end: 6 }, { start: 9, end: 10 }]
    const c: RegexMatch[] = [{ start: 4, end: 7 }, { start: 11, end: 12 }]
    const d: RegexMatch[] = [{ start: 5, end: 8 }, { start: 12, end: 13 }]
    const result = mergeRegexMatchesWithAnnotation(
      { label: 'A', matches: a },
      { label: 'B', matches: b },
      { label: 'C', matches: c },
      { label: 'D', matches: d }
    )
    expect(result).toEqual([
      { start: 2, end: 3, types: ["A"] },
      { start: 3, end: 4, types: ["A", "B"] },
      { start: 4, end: 5, types: ["A", "B", "C"] },
      { start: 5, end: 6, types: ["B", "C", "D"] },
      { start: 6, end: 7, types: ["C", "D"] },
      { start: 7, end: 8, types: ["D"] },
      { start: 8, end: 9, types: ["A"] },
      { start: 9, end: 10, types: ["B"] },
      { start: 11, end: 12, types: ["C"] },
      { start: 12, end: 13, types: ["D"] },
    ])
  })
})
