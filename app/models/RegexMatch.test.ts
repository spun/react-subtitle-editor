import { describe } from 'node:test'
import { expect, test } from 'vitest'
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
    const result = mergeRegexMatchesWithAnnotation('A', a, 'B', b)
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
    const result = mergeRegexMatchesWithAnnotation('A', a, 'B', b)
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
    const result = mergeRegexMatchesWithAnnotation('A', a, 'B', b)
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
    const result = mergeRegexMatchesWithAnnotation('A', a, 'B', b)
    expect(result).toEqual([{ start: 3, end: 14, types: ['A'] }])
  })

  test('merge empty matches', () => {
    const a: RegexMatch[] = []
    const b: RegexMatch[] = []
    const result = mergeRegexMatchesWithAnnotation('A', a, 'B', b)
    expect(result).toEqual([])
  })
})


