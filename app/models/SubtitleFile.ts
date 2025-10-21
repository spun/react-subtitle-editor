import type { SubtitleLine } from './SubtitleLine'

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

export function updateSelectedLineFromSubtitleFile(
  subtitleFile: SubtitleFile,
  subtitleLine: SubtitleLine
): SubtitleFile {
  const selectedLineIndex = subtitleFile.selectedLineIndex
  if (selectedLineIndex != null) {
    const newLines = [...subtitleFile.lines];
    newLines[selectedLineIndex] = subtitleLine;
    return updateLinesFromSubtitleFile(subtitleFile, newLines)
  } else {
    return subtitleFile
  }
}