import { LineState, type SubtitleLine } from "../../models/SubtitleLine";
import { IconButton } from "../buttons/buttons";
import { DeleteIcon, UndoIcon } from "../icons/icons";

interface LineProps {
  className?: string;
  value: SubtitleLine;
  onClick: () => void;
  onUndo: () => void;
  onDelete: () => void;
}

export function Line({ className, value, onClick, onUndo, onDelete }: LineProps) {

  return (
    <li className={'linePreview ' + (className ? `${className} ` : '') + (value.state === LineState.REMOVED ? 'removed ' : '') + (value.state === LineState.MODIFIED ? 'modified ' : '')} onClick={onClick}>
      <div className="lineContent">
        <p className="info">#{value.id} <span className="timestamp">{value.startTime}</span> ➔ <span className="timestamp">{value.endTime}</span></p>
        <p className="content" >{value.state == LineState.MODIFIED ? value.updatedText : value.text}</p>
      </div>
      <div className="lineActions">
        {value.state !== LineState.ENABLED &&
          <IconButton className="actionUndo" onClick={onUndo} ><UndoIcon /></IconButton>
        }
        {value.state !== LineState.REMOVED &&
          <IconButton className="actionDelete" onClick={onDelete} ><DeleteIcon /></IconButton>
        }
      </div>
    </li>
  )
}
