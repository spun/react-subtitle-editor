import { updateTimesFromSubtitleLine, type SubtitleLine } from './SubtitleLine'

export class NoLineSelectedError extends Error {
  constructor(
    message = "Attempted to update the selected line, but no line is selected."
  ) {
    super(message);
    this.name = "NoLineSelectedError";
    // Set the prototype explicitly.
    // Source: https://www.typescriptlang.org/docs/handbook/2/classes.html#inheriting-built-in-types
    Object.setPrototypeOf(this, NoLineSelectedError.prototype);
  }
}

export type SubtitleFile = {
  filename: string;
  lines: SubtitleLine[];
  selectedLineIndex: number | null;
}

export function updateSelectedLineIndexFromSubtitleFile(
  subtitleFile: SubtitleFile,
  selectedLineIndex: number | null
): SubtitleFile {
  return {
    ...subtitleFile,
    selectedLineIndex: selectedLineIndex
  }
}

export function updateLinesFromSubtitleFile(
  subtitleFile: SubtitleFile,
  lines: SubtitleLine[]
): SubtitleFile {
  return {
    ...subtitleFile,
    lines: lines
  };
}

export function updateLineFromSubtitleFile(
  subtitleFile: SubtitleFile,
  subtitleLine: SubtitleLine,
  lineIndex: number,
): SubtitleFile {
  const newLines = [...subtitleFile.lines];
  newLines[lineIndex] = subtitleLine;
  return updateLinesFromSubtitleFile(subtitleFile, newLines)
}

export function updateSelectedLineFromSubtitleFile(
  subtitleFile: SubtitleFile,
  subtitleLine: SubtitleLine
): SubtitleFile {
  const selectedLineIndex = subtitleFile.selectedLineIndex
  if (selectedLineIndex != null) {
    return updateLineFromSubtitleFile(subtitleFile, subtitleLine, selectedLineIndex)
  } else {
    throw new NoLineSelectedError()
  }
}