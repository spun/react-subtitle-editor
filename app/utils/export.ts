import type { SubtitleFile } from "~/models/SubtitleFile";
import { LineState, type SubtitleLine } from "~/models/SubtitleLine";

function printSubtitleLineAsSrtLine(number: number, line: SubtitleLine): string {
  const lineText = line.state === LineState.MODIFIED ? line.updatedText : line.text
  return `${String(number)}\r\n${line.startTime} --> ${line.endTime}\r\n${lineText}`
}

export function downloadSubtitleAsSrt(subtitleFile: SubtitleFile) {
  const lines = subtitleFile.lines
  const content = lines
    .filter(l => l.state !== LineState.REMOVED)
    .map((line, index) => printSubtitleLineAsSrtLine(index + 1, line))
    .join('\r\n\r\n') + '\r\n';
  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  // Create a temporary <a> element
  const a = document.createElement('a');
  a.href = url;
  a.download = subtitleFile.filename;
  // Append it to the DOM (some browsers need this)
  document.body.appendChild(a);
  // Trigger a click to start download
  a.click();
  // Clean up
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
