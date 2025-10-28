export enum LineState {
  ENABLED = 'ENABLED',
  REMOVED = 'REMOVED',
  MODIFIED = 'MODIFIED',
}

/**
 * Represents a line from an srt file
 */
type BaseSubtitleLine = {
  /**
   * The actual position of the line in the file (starting at 1),
   * regardless of the index indicated in the line.
   * The index indicated in the line itself is ignored since it 
   * may not be reliable.
   */
  id: number;
  /** Start time in srt format */
  startTime: string;
  /** Start time in milliseconds */
  startTimeMillis: number;
  /** End time in srt format */
  endTime: string;
  /** End time in milliseconds */
  endTimeMillis: number;
  /** Text is this subtitle line */
  text: string;
  /** State of the line (ENABLED, REMOVED, ETC) */
  state: LineState;
}

export type SubtitleLine =
  | (BaseSubtitleLine & { state: LineState.ENABLED | LineState.REMOVED })
  | (BaseSubtitleLine & { state: LineState.MODIFIED; updatedText: string })


function timeInMillisToSrtTime(timeInMillis: number) {
  const hours = Math.floor(timeInMillis / (1000 * 60 * 60));
  const minutes = Math.floor((timeInMillis % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeInMillis % (1000 * 60)) / 1000);
  const millis = timeInMillis % 1000;
  // Pad values
  const h = String(hours).padStart(2, '0');
  const m = String(minutes).padStart(2, '0');
  const s = String(seconds).padStart(2, '0');
  const ms = String(millis).padStart(3, '0');
  return `${h}:${m}:${s},${ms}`;
}

export function updateTimesFromSubtitleLine(
  subtitleLine: SubtitleLine,
  deltaInMillis: number,
): SubtitleLine {
  const newStartMillis = Math.max(subtitleLine.startTimeMillis + deltaInMillis, 0)
  const newEndMillis = Math.max(subtitleLine.endTimeMillis + deltaInMillis, 0)
  return {
    ...subtitleLine,
    startTime: timeInMillisToSrtTime(newStartMillis),
    startTimeMillis: newStartMillis,
    endTime: timeInMillisToSrtTime(newEndMillis),
    endTimeMillis: newEndMillis,
  }
}

export function updateStateFromSubtitleLine(
  subtitleLine: SubtitleLine,
  state: LineState,
): SubtitleLine {
  return {
    ...subtitleLine,
    state: state
  }
}
