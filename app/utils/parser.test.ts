import { describe, expect, test } from 'vitest'
import Parser from './parser'

const srtContent = `
1
00:00:01,000 --> 00:00:03,003
[♪ music playing ♪]

2
00:00:09,009 --> 00:00:10,385
Single line

3
00:00:10,468 --> 00:00:12,095
Multiple
lines
`.trim()

describe('srt parser', () => {

  test('timestamp to seconds', () => {
    const parser = new Parser();
    // This is the example given for the bad JS rounding fix.
    expect(parser.timestampToSeconds("00:01:20,460")).toEqual(80.46)
  })

  test('corrects bad timestamp formats', () => {
    const parser = new Parser();
    // From Parser#correctFormat comment
    expect(parser.correctFormat("00:00:28.9670")).toEqual("00:00:28,967");
    expect(parser.correctFormat("00:00:28.967")).toEqual("00:00:28,967");
    expect(parser.correctFormat("00:00:28.96")).toEqual("00:00:28,960");
    expect(parser.correctFormat("00:00:28.9")).toEqual("00:00:28,900");
    expect(parser.correctFormat("00:00:28,96")).toEqual("00:00:28,960");
    expect(parser.correctFormat("00:00:28,9")).toEqual("00:00:28,900");
    expect(parser.correctFormat("00:00:28,0")).toEqual("00:00:28,000");
    expect(parser.correctFormat("00:00:28,01")).toEqual("00:00:28,010");
    expect(parser.correctFormat("0:00:10,500")).toEqual("00:00:10,500");
    expect(parser.correctFormat("01:23:45.6780")).toEqual("01:23:45,678");
  })

  // Check if parser is using the correctFormat method
  test('parses incorrect timestamp formats', () => {
    const parser = new Parser();
    const dotMillis = parser.fromSrt("1\n01:3:45.6780 --> 1:23:4.6\nline text")
    expect(dotMillis).toEqual([
      {
        "id": "1",
        "startTime": "01:03:45,678",
        "startSeconds": 3825.678,
        "endTime": "01:23:04,600",
        "endSeconds": 4984.600,
        "text": "line text",
      },
    ])
  })

  test('parses content from an srt string', () => {
    const srtParser = new Parser();
    const lines = srtParser.fromSrt(srtContent)

    expect(lines).toEqual([
      {
        "id": "1",
        "startTime": "00:00:01,000",
        "startSeconds": 1,
        "endTime": "00:00:03,003",
        "endSeconds": 3.003,
        "text": "[♪ music playing ♪]",
      },
      {
        "id": "2",
        "endTime": "00:00:10,385",
        "endSeconds": 10.385,
        "startTime": "00:00:09,009",
        "startSeconds": 9.009,
        "text": "Single line",
      },
      {
        "id": "3",
        "endTime": "00:00:12,095",
        "endSeconds": 12.095,
        "startTime": "00:00:10,468",
        "startSeconds": 10.468,
        "text": "Multiple\nlines",
      },
    ]);
  })
});
