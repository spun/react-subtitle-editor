import { useEffect, useState, type ReactElement } from "react";
import { getRegexMatches, mergeRegexMatchesWithAnnotation as mergeRegexMatchesWithAnnotations, mergeRegexMatches, type AnnotatedRegexMatch, type RegexMatch } from "~/models/RegexMatch";
import { LineState, type SubtitleLine } from "~/models/SubtitleLine";
import { FilledButton, IconButton, OutlinedButton, TextButton } from "../buttons/buttons";
import { ApplyAllIcon, ApplyIcon, DeleteIcon } from "../icons/icons";

const hearingImpairedRegExps = [
  // Any string wrapped in between brackets
  // Common for character names and sounds
  /\[.*?\]/gs,
  // Also for character names and sounds but
  // only when they fill the whole line and
  // are displayed with another line.
  /^- ?\[[^\]]+\]\s*$/gm
]

const lyricsRegExps = [
  // Sometimes, lyrics are wrapped in between ♪
  /♪.*?♪/gs
]

/**
 * A subtitle list text can be split into
 * multiple LineChunk when we use regex to
 * remove part of the line.
 */
type LineChunk = {
  text: string;
  types: string[] | null;
}

/**
 * Holds the chunks of the subtitle line
 * and the final string if we remove all
 * chunks that where a match against our
 * regexps.
 */
type HighlightedLine = {
  id: number,
  chunks: LineChunk[],
  resultLine: string,
}

/**
 * Uses an AnnotatedRegexMatch list to split a line into different chunks
 * Each chunks will be styled differently by our UI to highlight which parts
 * of the line were matches.
 */
export function splitByMatches(text: string, matches: AnnotatedRegexMatch[]): LineChunk[] {

  // Ensure matches are sorted
  const sorted = [...matches].sort((a, b) => a.start - b.start);

  const chunks: LineChunk[] = [];
  let lastIndex = 0;
  for (const { start, end, types } of sorted) {
    // Add any non-highlighted chunk before this match
    if (start > lastIndex) {
      chunks.push({
        text: text.slice(lastIndex, start),
        types: null
      });
    }

    // Add highlighted (text is in match)
    chunks.push({
      text: text.slice(start, end),
      types: types
    });

    lastIndex = end;
  }

  // If after the last match we still have some text
  //  remaining, add it as non-highlighted chunk.
  if (lastIndex < text.length) {
    chunks.push({
      text: text.slice(lastIndex),
      types: null
    });
  }

  return chunks;
}


interface RegexFilterProps {
  lines: SubtitleLine[];
  onUpdateLines: (lines: SubtitleLine[]) => void;
}

export function RegexFilter({ lines, onUpdateLines: updateLines }: RegexFilterProps) {

  const [filterHearingImpaired, setFilterHearingImpaired] = useState(false)
  const [filterLyrics, setFilterLyrics] = useState(false)
  const [filteredLines, setFilteredLines] = useState<HighlightedLine[]>([])

  useEffect(() => {
    const filteredLines = lines
      .filter(l => l.state === LineState.ENABLED)
      .reduce<HighlightedLine[]>((acc, line) => {

        // Find hearing-impaired subtitles
        const hearingImpairedMatches: RegexMatch[] = []
        if (filterHearingImpaired) {
          const matchesPerRegex: RegexMatch[][] = hearingImpairedRegExps.map(regex =>
            getRegexMatches(line.text, regex)
          )
          hearingImpairedMatches.push(...mergeRegexMatches(...matchesPerRegex));
        }

        // Find song and lyrics
        const lyricsMatches: RegexMatch[] = []
        if (filterLyrics) {
          const matchesPerRegex: RegexMatch[][] = lyricsRegExps.map(regex =>
            getRegexMatches(line.text, regex)
          )
          lyricsMatches.push(...mergeRegexMatches(...matchesPerRegex));
        }

        // Merge matches from our different RegExp into one array while keeping a
        // reference to the original RegExp that got the match as an annotation.
        // This reference/annotation will be used as the className.
        const merged = mergeRegexMatchesWithAnnotations("cc", hearingImpairedMatches, "lyrics", lyricsMatches)

        // Use merged matches to chunk the line for each match.
        // This is useful for displaying the line where non-annotated (not matched
        // by any of our Regex) chunks are displayed as "default" text, and our
        // annotated chucks are highlighted using styles.
        const chunks = splitByMatches(line.text, merged)

        // We now have a way to highlight the words that got a match but we also
        // want to display how the line is going to look when those words are
        // removed.
        if (chunks.length > 1 || chunks[0]?.types != null) {
          const finalLine: string = chunks
            .filter((s) => s.types == null) // Keep only non-annotated chunks
            .map((s) => s.text)             // Get the text
            .join("")                       // Join chunk without any separator
            .replace(/\s{2,}/g, ' ')        // collapse multiple spaces
            .trim();                        // remove leading/trailing spaces

          acc.push({
            id: line.id,
            chunks: chunks,
            resultLine: finalLine
          })
        }

        return acc
      }, [])

    setFilteredLines(filteredLines)
  }, [lines, filterHearingImpaired, filterLyrics])


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

  return (
    <>
      <p>
        <label>
          <input type="checkbox" checked={filterHearingImpaired} onChange={e => setFilterHearingImpaired(e.target.checked)} />Hearing impaired
        </label>
      </p>
      <p>
        <label>
          <input type="checkbox" checked={filterLyrics} onChange={e => setFilterLyrics(e.target.checked)} />Lyrics
        </label>
      </p>
      <div className="actions">
        <OutlinedButton leadingIcon={ApplyAllIcon} onClick={handleApplyAllRemove}>Apply all</OutlinedButton >
      </div>

      <ul className="lineList" >
        {
          filteredLines.map((line, index) => {
            return (
              <li className="linePreview" key={index} >
                <ChunkedLine chunks={line.chunks} onClick={() => handleApplyLineRemove(line)} />
              </li>
            )
          })
        }
      </ul>
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
        <IconButton className="actionApply" onClick={onClick}><ApplyIcon /></IconButton>
      </div>
    </>
  )
}

interface LineActionProps {
  onClick: () => void;
}
