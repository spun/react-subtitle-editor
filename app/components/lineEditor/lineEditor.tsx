import type { ChangeEvent } from "react"
import type { SubtitleLine } from "../../models/SubtitleLine";
import "./lineEditor.css";

interface LineEditorProps {
  line: SubtitleLine;
  onLineEdit: (newLine: SubtitleLine) => void;
}

export function LineEditor({ line, onLineEdit }: LineEditorProps) {

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    onLineEdit({
      ...line,
      text: e.target.value
    })
  }

  return (
    <section className="lineEditorSheet">
      <div className="content">
        <p className="info">#{line.index} <span className="timestamp">{line.startTime}</span> ➔ <span className="timestamp">{line.endTime}</span></p>
        <textarea
          value={line.text} onChange={handleTextChange}
          rows={8}
          cols={40}
        />
      </div>
    </section>
  )
}
