import type { SubtitleFile } from "~/models/SubtitleFile";
import { FilledButton } from "../buttons/buttons";
import { SaveAsIcon } from "../icons/icons";
import './fileInfo.css'

interface FileInfoProps {
  file: SubtitleFile;
  onExport: () => void;
}

export function FileInfo({ file, onExport }: FileInfoProps) {
  return (
    <div className="fileInfo">
      <h2>File information</h2>
      <p><span>Name:</span>{file.filename}</p>
      <p><span>Number of lines:</span>{file.lines.length}</p>
      <div className="actions">
        <FilledButton leadingIcon={SaveAsIcon} onClick={onExport}>Export</FilledButton>
      </div>
    </div>
  )
}
