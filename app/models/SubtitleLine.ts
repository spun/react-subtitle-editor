export enum LineState {
  ENABLED = 'ENABLED',
  REMOVED = 'REMOVED',
  FILTERED = 'FILTERED',
}

export type SubtitleLine = {
  index: number;
  startTime: string;
  startTimeMillis: number;
  endTime: string;
  endTimeMillis: number;
  text: string;
  state: LineState;
}

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
