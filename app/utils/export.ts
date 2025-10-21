import type { SubtitleFile } from "~/models/SubtitleFile";
import type { SubtitleLine } from "~/models/SubtitleLine";

function printSubtitleLineAsSrtLine(line: SubtitleLine): string {
  return `${line.index}\r\n${line.startTime} --> ${line.endTime}\r\n${line.text}`
}

export function downloadSubtitleAsSrt(subtitleFile: SubtitleFile) {
  if (subtitleFile == null) return
  const lines = subtitleFile.lines
  const content = lines.map(line => printSubtitleLineAsSrtLine(line)).join('\r\n\r\n') + '\r\n';
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
