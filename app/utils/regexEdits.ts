import { getRegexMatches, mergeRegexMatches, mergeRegexMatchesWithAnnotation, type AnnotatedRegexMatch, type RegexMatch } from "~/models/RegexMatch";
import type { SubtitleLine } from "~/models/SubtitleLine";

interface FilterConfig {
  closedCaptions: boolean,
  lyrics: boolean,
  speakerLabels: boolean
}

const closedCaptionsRegExps = [
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

const speakerLabelsRegExps = [
  // Speaker labels like CHARACTER: 
  /^[A-Z][A-Z\s.\-']+:/gm
]

/**
 * A subtitle list text can be split into
 * multiple LineChunk when we use regex to
 * remove part of the line.
 */
export interface LineChunk {
  text: string;
  types: string[] | null;
}

/**
 * Holds the chunks of the subtitle line
 * and the final string if we remove all
 * chunks that where a match against our
 * regexps.
 */
export interface HighlightedLine {
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

/**
 * Applies the selected filters to all SubtitleLines
 */
export function applyFilters(
  lines: SubtitleLine[],
  filterConfig: FilterConfig
): HighlightedLine[] {

  return lines.reduce<HighlightedLine[]>((acc, line) => {
    const result = applyFiltersToLine(line.text, filterConfig)
    if (result !== null) {
      acc.push({
        id: line.id,
        chunks: result.chunks,
        resultLine: result.resultLine
      })
    }
    return acc
  }, [])
}

/**
 * Applies the selected filters to a line
 */
export function applyFiltersToLine(
  line: string,
  filterConfig: FilterConfig
): {
  chunks: LineChunk[],
  resultLine: string
} | null {
  // Find hearing-impaired subtitles
  const closedCaptionsMatches: RegexMatch[] = []
  if (filterConfig.closedCaptions) {
    const matchesPerRegex: RegexMatch[][] = closedCaptionsRegExps.map(regex =>
      getRegexMatches(line, regex)
    )
    closedCaptionsMatches.push(...mergeRegexMatches(...matchesPerRegex));
  }

  // Find song and lyrics
  const lyricsMatches: RegexMatch[] = []
  if (filterConfig.lyrics) {
    const matchesPerRegex: RegexMatch[][] = lyricsRegExps.map(regex =>
      getRegexMatches(line, regex)
    )
    lyricsMatches.push(...mergeRegexMatches(...matchesPerRegex));
  }

  // Find speaker labels
  const speakerLabelsMatches: RegexMatch[] = []
  if (filterConfig.speakerLabels) {
    const matchesPerRegex: RegexMatch[][] = speakerLabelsRegExps.map(regex =>
      getRegexMatches(line, regex)
    )
    speakerLabelsMatches.push(...mergeRegexMatches(...matchesPerRegex));
  }

  // Merge matches from our different RegExp into one array while keeping a
  // reference to the original RegExp that got the match as an annotation.
  // This reference/annotation will be used as the className.
  const merged = mergeRegexMatchesWithAnnotation(
    { label: "cc", matches: closedCaptionsMatches },
    { label: "lyrics", matches: lyricsMatches },
    { label: "speaker", matches: speakerLabelsMatches }
  )

  // Use merged matches to chunk the line for each match.
  // This is useful for displaying the line where non-annotated (not matched
  // by any of our Regex) chunks are displayed as "default" text, and our
  // annotated chucks are highlighted using styles.
  const chunks = splitByMatches(line, merged)

  // We now have a way to highlight the words that got a match but we also
  // want to display how the line is going to look when those words are
  // removed.
  if (chunks.length > 1 || chunks[0]?.types !== null) {
    const finalLine: string = chunks
      .filter((s) => s.types === null) // Keep only non-annotated chunks
      .map((s) => s.text)             // Get the text
      .join("")                       // Join chunk without any separator
      .replace(/\s{2,}/g, ' ')        // collapse multiple spaces
      .trim();                        // remove leading/trailing spaces

    return {
      chunks: chunks,
      resultLine: finalLine
    }
  } else {
    return null
  }
}