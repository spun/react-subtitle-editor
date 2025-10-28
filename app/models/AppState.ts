import type { SubtitleFile } from './SubtitleFile'
import type { SubtitleLine } from './SubtitleLine'
import { updateLinesFromSubtitleFile, updateSelectedLineFromSubtitleFile, updateSelectedLineIndexFromSubtitleFile } from './SubtitleFile'

export enum ActionPane {
  Lines = "LINES",
  Sync = "SYNC",
  RegexFilter = "REGEX_FILTER"
}

export interface AppState {
  currentSubtitle: SubtitleFile | null,
  selectedPane: ActionPane,
}

export function updateCurrentSubtitleFromAppState(
  appState: AppState,
  currentSubtitle: SubtitleFile | null
): AppState {
  return {
    ...appState,
    currentSubtitle: currentSubtitle
  }
}

export function updateSelectedPaneFromAppState(
  appState: AppState,
  pane: ActionPane
): AppState {
  return {
    ...appState,
    selectedPane: pane
  }
}

export function updateSelectedLineIndexFromAppState(
  appState: AppState,
  selectedLineIndex: number | null
): AppState {
  const currentSubtitle = appState.currentSubtitle
  if (currentSubtitle != null) {
    return {
      ...appState,
      currentSubtitle: updateSelectedLineIndexFromSubtitleFile(currentSubtitle, selectedLineIndex)
    }
  } else {
    return appState
  }
}

export function updateLinesFromAppState(
  appState: AppState,
  lines: SubtitleLine[]
): AppState {
  const currentSubtitle = appState.currentSubtitle
  if (currentSubtitle != null) {
    return {
      ...appState,
      currentSubtitle: updateLinesFromSubtitleFile(currentSubtitle, lines)
    }
  } else {
    return appState
  }
}


export function updateSelectedLineFromAppState(
  appState: AppState,
  subtitleLine: SubtitleLine
): AppState {
  const currentSubtitle = appState.currentSubtitle
  if (currentSubtitle != null) {
    return {
      ...appState,
      currentSubtitle: updateSelectedLineFromSubtitleFile(currentSubtitle, subtitleLine)
    }
  } else {
    return appState
  }
}