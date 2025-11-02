import { useRef, useState, type ChangeEvent } from 'react';
import type { SubtitleFile } from "../../models/SubtitleFile";
import { LineState } from '~/models/SubtitleLine';
import Parser from '../../utils/parser'
import './dragDropUpload.css'

const srtParser = new Parser();

interface DragDropUploadProps {
  showForm: boolean;
  onUpload: (subtitleFile: SubtitleFile) => void;
  appBar: React.ReactNode;
  children: React.ReactNode;
}

export function DragDropUpload({ showForm: showUploadForm, onUpload, appBar, children }: DragDropUploadProps) {

  // A drag and drop gesture will trigger multiple enter/leave events.
  // We need to count them to know when we should display dnd visual feedback.
  const dragCounter = useRef(0);
  const [isDragging, setIsDragging] = useState(false);

  // Read file from dnd or input and notify parent
  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      const srtString = reader.result
      if (srtString && typeof srtString === "string") {
        const parsedLines = srtParser.fromSrt(srtString)
        onUpload({
          filename: file.name,
          lines: parsedLines.map((line, index) => ({
            id: index + 1,
            startTime: line.startTime,
            startTimeMillis: line.startSeconds * 1000,
            endTime: line.endTime,
            endTimeMillis: line.endSeconds * 1000,
            text: line.text,
            state: LineState.ENABLED
          })),
          selectedLineIndex: null
        })
      }
    };
    reader.onerror = () => {
      console.log("Error reading the file. Please try again.", "error");
    };
    reader.readAsText(file);
  }

  // Receive upload events from input file
  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    // TODO: Check file extension
    // TODO: Check number of files uploaded
    if (!event.target.files) return;
    const file = event.target.files[0];
    handleFile(file)
  }

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current--;
    // only clear when leaving the whole wrapper
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    // Reset dragging feedback
    dragCounter.current = 0
    setIsDragging(false);
    // handle file
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFile(file)
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    // Needed to allow dropping
    e.preventDefault();
  };

  return (
    <div className={`dragDropUpload ${isDragging ? 'dragging' : ''}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      {appBar}
      {showUploadForm ? (
        <section className="uploadForm">
          <p className="dropCircle">Drop here</p>
          <label className="uploadButton">
            <input type="file" accept=".srt,text/plain" onChange={handleFileChange} />
            Or click here to browse
          </label>
        </section>
      ) : (
        <>
          {children}
        </>
      )}
    </div>
  )
}
