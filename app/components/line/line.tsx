import type { SubtitleLine } from "../../models/SubtitleLine";

interface LineProps {
  className?: string | undefined;
  value: SubtitleLine;
  onClick: () => void;
}

export function Line({ className, value, onClick }: LineProps) {

  return (
    <li className={'linePreview ' + (className || '')} onClick={onClick}>
      <p className="info">#{value.index} <span className="timestamp">{value.startTime}</span> ➔ <span className="timestamp">{value.endTime}</span></p>
      <p className="content" >{value.text}</p>
    </li>
  )
}