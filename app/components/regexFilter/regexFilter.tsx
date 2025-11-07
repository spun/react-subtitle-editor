import { useMemo, useState } from "react";
import { LineState, type SubtitleLine } from "~/models/SubtitleLine";
import { IconButton, OutlinedButton } from "../buttons/buttons";
import { ApplyAllIcon, ApplyIcon } from "../icons/icons";
import { applyFilters, type HighlightedLine, type LineChunk } from "~/utils/regexEdits";
import './regexFilter.css'

interface RegexFilterProps {
  lines: SubtitleLine[];
  onUpdateLines: (lines: SubtitleLine[]) => void;
}

export function RegexFilter({ lines, onUpdateLines: updateLines }: RegexFilterProps) {

  const [filterHearingImpaired, setFilterHearingImpaired] = useState(false)
  const [filterLyrics, setFilterLyrics] = useState(false)
  const [filterSpeakerLabels, setFilterSpeakerLabels] = useState(false)

  const filteredLines = useMemo(() => {
    const enabledLines = lines.filter(l => l.state === LineState.ENABLED)
    return applyFilters(enabledLines, {
      closedCaptions: filterHearingImpaired,
      lyrics: filterLyrics,
      speakerLabels: filterSpeakerLabels
    })
  }, [lines, filterHearingImpaired, filterLyrics, filterSpeakerLabels])

  const handleApplyAllRemove = () => {
    const updatedLines = [...lines];
    for (const filteredLine of filteredLines) {
      const newText = filteredLine.resultLine
      if (newText !== "") {
        updatedLines[filteredLine.id - 1] = {
          ...updatedLines[filteredLine.id - 1],
          state: LineState.MODIFIED,
          updatedText: newText
        }
      } else {
        updatedLines[filteredLine.id - 1].state = LineState.REMOVED
      }
    }
    updateLines(updatedLines)
  }


  const handleApplyLineRemove = (highlightedLine: HighlightedLine) => {
    const updatedLines = [...lines];
    const newText = highlightedLine.resultLine
    if (newText !== "") {
      updatedLines[highlightedLine.id - 1] = {
        ...updatedLines[highlightedLine.id - 1],
        state: LineState.MODIFIED,
        updatedText: newText
      }
    } else {
      updatedLines[highlightedLine.id - 1].state = LineState.REMOVED
    }
    updateLines(updatedLines)
  }

  return (<>
    <section className="regexFilter card">
      <div className="filterOptions">
        <h3>Filter</h3>
        <p>
          <label>
            <input type="checkbox" checked={filterHearingImpaired} onChange={e => { setFilterHearingImpaired(e.target.checked) }} />Hearing impaired
          </label>
        </p>
        <p>
          <label>
            <input type="checkbox" checked={filterLyrics} onChange={e => { setFilterLyrics(e.target.checked) }} />Lyrics
          </label>
        </p>
        <p>
          <label>
            <input type="checkbox" checked={filterSpeakerLabels} onChange={e => { setFilterSpeakerLabels(e.target.checked) }} />Speaker labels
          </label>
        </p>
        <div className="actions">
          <OutlinedButton leadingIcon={ApplyAllIcon} onClick={handleApplyAllRemove}>Apply to all</OutlinedButton >
        </div>
      </div>

      <ul className="changesPreview">
        {
          filteredLines.map((line, index) => {
            return (
              <li className="line" key={index} >
                <ChunkedLine chunks={line.chunks} onClick={() => { handleApplyLineRemove(line) }} />
              </li>
            )
          })
        }
      </ul>
    </section>
  </>
  )
}

interface ChunkedLineProps {
  chunks: LineChunk[];
  onClick: () => void;
}

function ChunkedLine({ chunks, onClick }: ChunkedLineProps) {
  return (
    <>
      <div className="lineContent">
        <p className="content">
          {
            chunks.map((chunk, index) => {
              const classes = chunk.types ? `matchHighlight ${chunk.types.join(' ')}` : '';
              return (
                <span key={index} className={classes}>{chunk.text}</span>
              )
            })
          }
        </p>
      </div>

      <div className="lineActions">
        <IconButton className="actionApply" onClick={onClick} ariaLabel="Apply changes to line"><ApplyIcon /></IconButton>
      </div>
    </>
  )
}
