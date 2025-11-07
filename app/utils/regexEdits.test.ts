import { describe, expect, test } from "vitest"
import { applyFiltersToLine, splitByMatches } from "./regexEdits"

const closedCaptionLines = [
  {
    original: "[FOOTSTEPS]",
    expected: ""
  },
  {
    original: "[TIRES SCREECH] [SCREAMS]",
    expected: ""
  },
  {
    original: "[WHISPERS] Pardon me.",
    expected: "Pardon me."
  },
  /*
  {
    original: "MAN [OVER RADIO]: Well, of course it doesn't",
    expect: "MAN: Well, of course it doesn't"
  }
  */
]

const lyricLines = [
  {
    original: "♪ lyrics ♪",
    expected: ""
  },
]

const speakerLabelLines = [
  {
    original: "WOMAN: Ugh.",
    expected: "Ugh."
  },
  {
    original: "- Hi, darling. WOMAN: Hmm.",
    expected: "- Hi, darling\n- Hmm."
  },
  {
    original: "S: Hi, ladies. WOMAN: Hi.",
    expected: "- Hi, ladies.\n- Hi."
  }
]

describe('regex replace', () => {

  test("closed captions", () => {
    for (const ccLine of closedCaptionLines) {
      const result = applyFiltersToLine(ccLine.original, {
        closedCaptions: true,
        lyrics: false,
        speakerLabels: false
      })
      expect(result?.resultLine).toEqual(ccLine.expected)
    }
  })

  test("lyrics", () => {
    for (const lyLine of lyricLines) {
      const result = applyFiltersToLine(lyLine.original, {
        closedCaptions: false,
        lyrics: true,
        speakerLabels: false
      })
      expect(result?.resultLine).toEqual(lyLine.expected)
    }
  })

  test("speaker labels", () => {
    for (const slLine of speakerLabelLines) {
      const result = applyFiltersToLine(slLine.original, {
        closedCaptions: false,
        lyrics: false,
        speakerLabels: true
      })
      expect(result?.resultLine).toEqual(slLine.expected)
    }
  })
})

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