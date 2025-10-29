import { describe, expect, test } from 'vitest'
import { NoLineSelectedError, updateLineFromSubtitleFile, updateLinesFromSubtitleFile, updateSelectedLineFromSubtitleFile, updateSelectedLineIndexFromSubtitleFile, type SubtitleFile } from "./SubtitleFile";
import { LineState } from "./SubtitleLine";

const initialSubtitleFile: SubtitleFile = {
  filename: "subtitle.srt",
  lines: [{
    id: 1,
    startTime: "00:00:01,100",
    startTimeMillis: 1100,
    endTime: "00:00:02,200",
    endTimeMillis: 2200,
    text: "line text 1",
    state: LineState.ENABLED
  }, {
    id: 2,
    startTime: "00:00:03,300",
    startTimeMillis: 3300,
    endTime: "00:00:04,400",
    endTimeMillis: 4400,
    text: "line text 2",
    state: LineState.ENABLED
  }],
  selectedLineIndex: null
}

describe('SubtitleFile', () => {
  test('file selectedLineIndex can be updated', () => {
    const newSelectedLineIndex = 1
    const updatedFile = updateSelectedLineIndexFromSubtitleFile(initialSubtitleFile, newSelectedLineIndex)
    expect(updatedFile.selectedLineIndex).toEqual(newSelectedLineIndex)
  })


  test('file lines can be updated', () => {
    const newLines = [initialSubtitleFile.lines[0]]
    const updatedFile = updateLinesFromSubtitleFile(initialSubtitleFile, newLines)
    expect(updatedFile.lines).toEqual(newLines)
  })

  test('file line can be updated', () => {
    const newLine = { ...initialSubtitleFile.lines[0], text: "modified line" }
    const updatedFile = updateLineFromSubtitleFile(initialSubtitleFile, newLine, 0)
    expect(updatedFile.lines[0]).toEqual(newLine)
  })

  test('file selected line can be updated', () => {
    const selectedLineIndex = 0
    const fileWithSelectedLine = { ...initialSubtitleFile, selectedLineIndex: selectedLineIndex }
    const newLine = { ...fileWithSelectedLine.lines[0], text: "modified line" }
    const updatedFile = updateSelectedLineFromSubtitleFile(fileWithSelectedLine, newLine)
    expect(updatedFile.lines[selectedLineIndex]).toEqual(newLine)
  })

  test('file with null selected line cannot be updated', () => {
    const newLine = { ...initialSubtitleFile.lines[0], text: "modified line" }
    expect(() => {
      updateSelectedLineFromSubtitleFile(initialSubtitleFile, newLine)
    }).toThrow(NoLineSelectedError)
  })

  // ---

  test('file selectedLineIndex updates return new object', () => {
    const updatedFile = updateSelectedLineIndexFromSubtitleFile(initialSubtitleFile, initialSubtitleFile.selectedLineIndex)
    // Content is the same but they are not the same reference
    expect(updatedFile).toEqual(initialSubtitleFile)
    expect(updatedFile).not.toBe(initialSubtitleFile)
  })

  test('file lines updates return new object', () => {
    const updatedFile = updateLinesFromSubtitleFile(initialSubtitleFile, initialSubtitleFile.lines)
    // Content is the same but they are not the same reference
    expect(updatedFile).toEqual(initialSubtitleFile)
    expect(updatedFile).not.toBe(initialSubtitleFile)
  })

  test('file line updates return new object', () => {
    const updatedFile = updateLineFromSubtitleFile(initialSubtitleFile, initialSubtitleFile.lines[0], 0)
    // Content is the same but they are not the same reference
    expect(updatedFile).toEqual(initialSubtitleFile)
    expect(updatedFile).not.toBe(initialSubtitleFile)
  })

  test('file selected line updates return new object', () => {
    const selectedLineIndex = 0
    const fileWithSelectedLine = { ...initialSubtitleFile, selectedLineIndex: selectedLineIndex }
    const newLine = fileWithSelectedLine.lines[selectedLineIndex]
    const updatedFile = updateSelectedLineFromSubtitleFile(fileWithSelectedLine, newLine)
    // Content is the same but they are not the same reference
    expect(updatedFile).toEqual(fileWithSelectedLine)
    expect(updatedFile).not.toBe(fileWithSelectedLine)
  })
})