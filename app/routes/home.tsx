import { useState } from 'react';

import { ActionPane, updateCurrentSubtitleFromAppState, updateLinesFromAppState, updateSelectedLineFromAppState, updateSelectedLineIndexFromAppState, updateSelectedPaneFromAppState, type AppState } from "~/models/AppState";
import { updateLineFromSubtitleFile, type SubtitleFile } from '~/models/SubtitleFile';
import { LineState, updateStateFromSubtitleLine, updateTimesFromSubtitleLine, type SubtitleLine } from "~/models/SubtitleLine";
import { downloadSubtitleAsSrt } from '~/utils/export';
import { DragDropUpload } from '~/components/dragDropUpload/dragDropUpload';
import { SegmentedButton } from '~/components/segmentedButton/segmentedButton';
import { LinesPreview } from '~/components/linesPreview/linesPreview';
import { LineEditor } from '~/components/lineEditor/lineEditor';
import { RegexFilter } from '~/components/regexFilter/regexFilter';
import { FileInfo } from '~/components/fileInfo/fileInfo';
import { TopBar } from '~/components/topBar/topBar';
import { useTheme } from '~/utils/useTheme';
import { SyncSettings } from '~/components/syncSettings/syncSettings';

export function meta(/*{ }: Route.MetaArgs*/) {
  return [
    { title: "Online subtitle editor" },
    { name: "description", content: "Edit srt subtitles from your browser." },
  ];
}

export default function Home() {

  // We set the theme outside AppState because the selected value is stored in localStorage
  // and managing it inside AppState could be complicated.
  const [theme, setTheme] = useTheme("system");
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
    if (currentSubtitle !== null) {
      const newSelectedLineIndex = lineIndex !== currentSubtitle.selectedLineIndex ? lineIndex : null
      const newAppState = updateSelectedLineIndexFromAppState(appState, newSelectedLineIndex)
      setAppState(newAppState)
    }
  }

  // Change line state to mark it as removed
  const handleLineUndo = (lineIndex: number) => {
    if (currentSubtitle !== null) {
      const line = currentSubtitle.lines[lineIndex]
      const updatedLine = updateStateFromSubtitleLine(line, LineState.ENABLED)
      const updatedFile = updateLineFromSubtitleFile(currentSubtitle, updatedLine, lineIndex)
      const newAppState = updateLinesFromAppState(appState, updatedFile.lines)
      setAppState(newAppState)
    }
  }

  // Change line state to mark it as removed
  const handleLineDeletion = (lineIndex: number) => {
    if (currentSubtitle !== null) {
      const line = currentSubtitle.lines[lineIndex]
      const updatedLine = updateStateFromSubtitleLine(line, LineState.REMOVED)
      const updatedFile = updateLineFromSubtitleFile(currentSubtitle, updatedLine, lineIndex)
      const newAppState = updateLinesFromAppState(appState, updatedFile.lines)
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
    if (currentSubtitle !== null) {
      const newAppState = updateCurrentSubtitleFromAppState(appState, null)
      setAppState(newAppState)
    }
  }

  // Create and download a valid srt file with the current list of lines
  const handleExport = () => {
    if (currentSubtitle !== null) {
      downloadSubtitleAsSrt(currentSubtitle)
    }
  }

  // Add or remove time to all lines
  const handleSyncRequest = (deltaInMillis: number) => {
    if (currentSubtitle === null) return
    const lines = currentSubtitle.lines
    const updatedLines = lines.map(line => {
      return updateTimesFromSubtitleLine(line, deltaInMillis)
    })
    const newAppState = updateLinesFromAppState(appState, updatedLines)
    setAppState(newAppState)
  }

  const handleLinesUpdate = (lines: SubtitleLine[]) => {
    const newAppState = updateLinesFromAppState(appState, lines)
    setAppState(newAppState)
  }

  return (
    <>
      {/* 
          We don't need to wrap it for the theme to be applied 
          :root will search for this class name and apply the correct theme 
        */}
      <div className={theme} />
      <DragDropUpload
        showForm={currentSubtitle === null}
        onUpload={handleUpload}
        appBar={
          <TopBar theme={theme} setTheme={setTheme} isFileOpen={currentSubtitle !== null} onClose={handleClose} />
        }
      >
        {currentSubtitle !== null &&
          <>
            <main>
              { /* File info block. Name, num lines, export, etc.*/}
              <header className="card">
                <FileInfo file={currentSubtitle} onExport={handleExport} />
              </header>

              { /* Action filter. Select which action is visible.*/}
              <nav className='filterActionWrapper'>
                <SegmentedButton
                  options={[
                    { id: ActionPane.Lines, key: "lines", text: "Lines" },
                    { id: ActionPane.Sync, key: "sync", text: "Sync" },
                    { id: ActionPane.RegexFilter, key: "regex_filter", text: "Filter" },
                  ]}
                  selected={appState.selectedPane}
                  onSelected={handleSelectedPane} />
              </nav>

              { /* Display Sync panel. Add or remove time to all lines. */}
              {appState.selectedPane === ActionPane.Sync &&
                <SyncSettings onSyncRequest={handleSyncRequest} />
              }

              { /* Display lines. Edit line by line. */}
              {appState.selectedPane === ActionPane.Lines &&
                <section>
                  <LinesPreview lines={currentSubtitle.lines} selectedLineIndex={currentSubtitle.selectedLineIndex}
                    onLineSelected={handleLineSelection}
                    onLineUndo={handleLineUndo}
                    onLineDeleted={handleLineDeletion}
                  />
                </section>
              }

              { /* Display regex filter panel. Search and remove using regex. */}
              {appState.selectedPane === ActionPane.RegexFilter &&
                <RegexFilter lines={currentSubtitle.lines} onUpdateLines={handleLinesUpdate} />
              }

              { /* Selected line editor. Outside of main to fill the whole width */}
              {currentSubtitle.selectedLineIndex !== null && appState.selectedPane === ActionPane.Lines &&
                <LineEditor line={currentSubtitle.lines[currentSubtitle.selectedLineIndex]} onLineEdit={handleLineEdit} />
              }
            </main>
          </>
        }
      </DragDropUpload>
    </>
  )
}
