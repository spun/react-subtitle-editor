import { useState } from 'react';

import type { Route } from "./+types/home";
import { ActionPane, updateCurrentSubtitleFromAppState, updateLinesFromAppState, updateSelectedLineFromAppState, updateSelectedLineIndexFromAppState, updateSelectedPaneFromAppState, type AppState } from "~/models/AppState";
import type { SubtitleFile } from '~/models/SubtitleFile';
import { updateTimesFromSubtitleLine, type SubtitleLine } from "~/models/SubtitleLine";
import { downloadSubtitleAsSrt } from '~/utils/export';
import { DragDropUpload } from '~/components/dragDropUpload/dragDropUpload';
import { SegmentedButton } from '~/components/segmentedButton/segmentedButton';
import { TimeInput } from '~/components/timeInput/timeInput';
import { Line } from '~/components/line/line';
import { LineEditor } from '~/components/lineEditor/lineEditor';

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "Online subtitle editor" },
    { name: "description", content: "Edit srt subtitles from your browser." },
  ];
}

export default function Home() {

  const [appState, setAppState] = useState<AppState>({ currentSubtitle: null, selectedPane: ActionPane.Lines })
  const currentSubtitle = appState.currentSubtitle

  // New file upload. Replace current.
  const handleUpload = (subtitleFile: SubtitleFile) => {
    const newAppState = updateCurrentSubtitleFromAppState(appState, subtitleFile)
    setAppState(newAppState)
  }

  // Change visible action pane
  const handleSelectedPane = (pane: ActionPane) => {
    const newAppState = updateSelectedPaneFromAppState(appState, pane)
    setAppState(newAppState)
  }

  // Modify selected line to show/hide the line editor
  const handleLineSelection = (lineIndex: number) => {
    if (currentSubtitle != null) {
      const newSelectedLineIndex = lineIndex != currentSubtitle.selectedLineIndex ? lineIndex : null
      const newAppState = updateSelectedLineIndexFromAppState(appState, newSelectedLineIndex)
      setAppState(newAppState)
    }
  }

  // Update selected line with the new value from the line editor
  const handleLineEdit = (updatedLine: SubtitleLine) => {
    const newAppState = updateSelectedLineFromAppState(appState, updatedLine)
    setAppState(newAppState)
  }

  // Close file to show the upload form
  const handleClose = () => {
    if (currentSubtitle != null) {
      const newAppState = updateCurrentSubtitleFromAppState(appState, null)
      setAppState(newAppState)
    }
  }

  // Create and download a valid srt file with the current list of lines
  const handleExport = () => {
    if (currentSubtitle != null) {
      downloadSubtitleAsSrt(currentSubtitle)
    }
  }

  // Add or remove time to all lines
  const handleSyncRequest = (deltaInMillis: number) => {
    if (currentSubtitle == null) return
    const lines = currentSubtitle.lines
    const updatedLines = lines.map(line => {
      return updateTimesFromSubtitleLine(line, deltaInMillis)
    })
    const newAppState = updateLinesFromAppState(appState, updatedLines)
    setAppState(newAppState)
  }

  return (
    <DragDropUpload showForm={currentSubtitle == null} onUpload={handleUpload}>
      {currentSubtitle != null &&
        <>
          <nav className="appBar">
            <button className="button textButton" onClick={() => handleClose()}>Close</button>
          </nav>

          <main>
            { /* File info block. Name, num lines, export, etc.*/}
            <header className='fileInfo'>
              <h2>File information</h2>
              <p><span>Name:</span>{currentSubtitle.filename}</p>
              <p><span>Number of lines:</span>{currentSubtitle.lines.length}</p>
              <div className="actions">
                <button className="button filledButton" onClick={() => handleExport()}>Export</button>
              </div>
            </header>

            { /* Action filter. Select which action is visible.*/}
            <section className="filterActionWrapper">
              <SegmentedButton
                options={[
                  { id: ActionPane.Lines, key: "lines", text: "Lines" },
                  { id: ActionPane.Sync, key: "sync", text: "Sync" },
                ]}
                selected={appState.selectedPane}
                onSelected={handleSelectedPane} />
            </section>

            { /* Display Sync panel. Add or remove time to all lines. */}
            {appState.selectedPane == ActionPane.Sync &&
              <section className="timeSyncWrapper">
                <h3>Sync correction</h3>
                <TimeInput onSyncRequest={handleSyncRequest} />
              </section>
            }

            { /* Display lines. Edit line by line. */}
            {appState.selectedPane == ActionPane.Lines &&
              <section>
                <ul className="lineList">
                  {
                    currentSubtitle.lines.map((line, index) => {
                      const isSelected = index === currentSubtitle.selectedLineIndex;
                      return (
                        <Line
                          key={index}
                          className={isSelected ? "selected" : ""}
                          value={line}
                          onClick={() => handleLineSelection(index)} />
                      )
                    })
                  }
                </ul>
              </section>
            }
          </main>

          { /* Selected line editor. Outside of main to fill the whole width */}
          {currentSubtitle.selectedLineIndex != null && appState.selectedPane == ActionPane.Lines &&
            <LineEditor line={currentSubtitle.lines[currentSubtitle.selectedLineIndex]} onLineEdit={handleLineEdit} />
          }
        </>
      }
    </DragDropUpload>
  );
}
