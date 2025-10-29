import { describe, expect, test } from 'vitest'
import { LineState, updateStateFromSubtitleLine, updateTimesFromSubtitleLine, type SubtitleLine } from './SubtitleLine'

describe('SubtitleLine', () => {

  test('line state is updated', () => {
    const initial: SubtitleLine = {
      id: 1,
      startTime: "00:00:01,100",
      startTimeMillis: 1.1,
      endTime: "00:00:2,200",
      endTimeMillis: 2.2,
      text: "line text",
      state: LineState.ENABLED
    }
    const newState = LineState.REMOVED
    const updatedLine = updateStateFromSubtitleLine(initial, newState)
    expect(updatedLine.state).toEqual(newState)
  })

  test('line times are updated with positive delta', () => {
    const initial: SubtitleLine = {
      id: 1,
      startTime: "00:00:01,100",
      startTimeMillis: 1100,
      endTime: "00:00:02,200",
      endTimeMillis: 2200,
      text: "line text",
      state: LineState.ENABLED
    }
    const delta = 3661100 // add 1h 1min 1sec 100ms
    const updatedLine = updateTimesFromSubtitleLine(initial, delta)
    expect(updatedLine).toEqual({
      id: 1,
      startTime: "01:01:02,200",
      startTimeMillis: 3662200,
      endTime: "01:01:03,300",
      endTimeMillis: 3663300,
      text: "line text",
      state: LineState.ENABLED
    })
  })

  test('line times are updated with negative delta', () => {
    const initial: SubtitleLine = {
      id: 1,
      startTime: "01:01:02,200",
      startTimeMillis: 3662200,
      endTime: "01:01:03,300",
      endTimeMillis: 3663300,
      text: "line text",
      state: LineState.ENABLED
    }
    const delta = -3661100 // remove 1h 1min 1sec 100ms
    const updatedLine = updateTimesFromSubtitleLine(initial, delta)
    expect(updatedLine).toEqual({
      id: 1,
      startTime: "00:00:01,100",
      startTimeMillis: 1100,
      endTime: "00:00:02,200",
      endTimeMillis: 2200,
      text: "line text",
      state: LineState.ENABLED
    })
  })

  // ---

  test('line state updates return new object', () => {
    const initial: SubtitleLine = {
      id: 1,
      startTime: "00:00:01,100",
      startTimeMillis: 1.1,
      endTime: "00:00:2,200",
      endTimeMillis: 2.2,
      text: "line text",
      state: LineState.ENABLED
    }
    const updatedLine = updateStateFromSubtitleLine(initial, LineState.ENABLED)
    // Content is the same but they are not the same reference
    expect(updatedLine).toEqual(initial)
    expect(updatedLine).not.toBe(initial)
  })

  test('line times updates return new object', () => {
    const initial: SubtitleLine = {
      id: 1,
      startTime: "00:00:01,100",
      startTimeMillis: 1100,
      endTime: "00:00:02,200",
      endTimeMillis: 2200,
      text: "line text",
      state: LineState.ENABLED
    }
    const updatedLine = updateTimesFromSubtitleLine(initial, 0)
    // Content is the same but they are not the same reference
    expect(updatedLine).toEqual(initial)
    expect(updatedLine).not.toBe(initial)
  })
})