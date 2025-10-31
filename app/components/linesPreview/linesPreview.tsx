import { LineState, type SubtitleLine } from "../../models/SubtitleLine";
import { IconButton } from "../buttons/buttons";
import { DeleteIcon, UndoIcon } from "../icons/icons";
import './linesPreview.css'

interface LinesPreviewProps {
  lines: SubtitleLine[];
  selectedLineIndex: number | null,
  onLineSelected: (index: number) => void,
  onLineUndo: (index: number) => void,
  onLineDeleted: (index: number) => void,
}


export function LinesPreview({ lines, selectedLineIndex, onLineSelected, onLineUndo, onLineDeleted }: LinesPreviewProps) {
  return (
    <ul className="linesPreview">
      {
        lines.map((line, index) => {
          const isSelected = index === selectedLineIndex;
          return (
            <Line
              key={line.id}
              className={isSelected ? "selected" : ""}
              value={line}
              onClick={() => { onLineSelected(index) }}
              onUndo={() => { onLineUndo(index) }}
              onDelete={() => { onLineDeleted(index) }} />
          )
        })
      }
    </ul>)
}


interface LineProps {
  className?: string;
  value: SubtitleLine;
  onClick: () => void;
  onUndo: () => void;
  onDelete: () => void;
}

function Line({ className, value, onClick, onUndo, onDelete }: LineProps) {

  return (
    <li className={'line ' + (className ? `${className} ` : '') + (value.state === LineState.REMOVED ? 'removed ' : '') + (value.state === LineState.MODIFIED ? 'modified ' : '')} onClick={onClick}>
      <div className="lineContent">
        <p className="info">#{value.id} <span className="timestamp">{value.startTime}</span> ➔ <span className="timestamp">{value.endTime}</span></p>
        <p className="content" >{value.state === LineState.MODIFIED ? value.updatedText : value.text}</p>
      </div>
      <div className="lineActions">
        {value.state !== LineState.ENABLED &&
          <IconButton className="actionUndo" onClick={onUndo} ariaLabel="Undo changes"><UndoIcon /></IconButton>
        }
        {value.state !== LineState.REMOVED &&
          <IconButton className="actionDelete" onClick={onDelete} ariaLabel="Delete line"><DeleteIcon /></IconButton>
        }
      </div>
    </li>
  )
}
