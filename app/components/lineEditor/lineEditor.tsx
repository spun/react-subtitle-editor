import type { ChangeEvent } from "react"
import { LineState, type SubtitleLine } from "../../models/SubtitleLine";
import "./lineEditor.css";

interface LineEditorProps {
  line: SubtitleLine;
  onLineEdit: (newLine: SubtitleLine) => void;
}

export function LineEditor({ line, onLineEdit }: LineEditorProps) {

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value
    // Check if, after the edit, the new text is back to the original one
    const updatedLine = (line.state === LineState.MODIFIED && line.text === newText) ? {
      ...line,
      state: LineState.ENABLED,
    } : {
      ...line,
      state: LineState.MODIFIED,
      updatedText: e.target.value
    }
    onLineEdit(updatedLine)
  }

  return (
    <section className="lineEditorSheet">
      <div className="content">
        <p className="info">#{line.id} <span className="timestamp">{line.startTime}</span> ➔ <span className="timestamp">{line.endTime}</span></p>
        <textarea
          value={line.state === LineState.MODIFIED ? line.updatedText : line.text} onChange={handleTextChange}
          rows={8}
          cols={40}
        />
      </div>
    </section>
  )
}
