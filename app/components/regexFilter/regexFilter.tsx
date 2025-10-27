import { useEffect, useState } from "react";
import { getRegexMatches, mergeRegexMatchesWithAnnotation as mergeRegexMatchesWithAnnotations, mergeRegexMatches, type AnnotatedRegexMatch, type RegexMatch } from "~/models/RegexMatch";
import { type SubtitleLine } from "~/models/SubtitleLine";

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
}

export function RegexFilter({ lines }: RegexFilterProps) {

  const [filterHearingImpaired, setFilterHearingImpaired] = useState(false)
  const [filterLyrics, setFilterLyrics] = useState(false)
  const [filteredLines, setFilteredLines] = useState<HighlightedLine[]>([])

  useEffect(() => {
    const filteredLines = lines.reduce<HighlightedLine[]>((acc, line) => {

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
      if (chunks.length > 1 || chunks[0].types != null) {
        const finalLine: string = chunks
          .filter((s) => s.types == null) // Keep only non-annotated chunks
          .map((s) => s.text)             // Get the text
          .join("")                       // Join chunk without any separator
          .replace(/\s{2,}/g, ' ')        // collapse multiple spaces
          .trim();                        // remove leading/trailing spaces

        acc.push({
          chunks: chunks,
          resultLine: finalLine
        })
      }

      return acc
    }, [])

    setFilteredLines(filteredLines)
  }, [lines, filterHearingImpaired, filterLyrics])


  return (
    <>
      <p>
        <input type="checkbox" checked={filterHearingImpaired} onChange={e => setFilterHearingImpaired(e.target.checked)} />Hearing impaired
      </p>
      <p>
        <input type="checkbox" checked={filterLyrics} onChange={e => setFilterLyrics(e.target.checked)} />Lyrics
      </p>
      < ul className="lineList" >
        {
          filteredLines.map((line, index) => {
            return (
              <li className="linePreview" key={index} >
                <ChunkedLine chunks={line.chunks} />
                ---
                <p className="content">{line.resultLine}</p>
              </li>)
          })
        }
      </ul >
    </>
  )
}

interface ChunkedLineProps {
  chunks: LineChunk[];
}

function ChunkedLine({ chunks }: ChunkedLineProps) {
  return (
    <p className="content">
      {
        chunks.map((chunk, index) => {
          const classes = chunk.types ? `matchHighlight ${chunk.types.join(' ')}` : '';
          return (
            <span className={classes}>{chunk.text}</span>
          )
        })
      }
    </p >
  )
}
