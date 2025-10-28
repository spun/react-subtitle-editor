import { arraysHaveSameElements } from "~/utils/arraysCompare";

export interface RegexMatch {
  start: number,
  end: number
}

export type AnnotatedRegexMatch = RegexMatch & {
  types: string[]
}

/**
 * Use RegExp to find occurrences inside the text.
 * NOTE: The returned end index is "one past" the last character of the match (exclusive end). 
 *       This is useful when we use slice(start, end).
 * @returns Array of RegexMatch where each entry has the start and end index for a match.
 */
export function getRegexMatches(text: string, regex: RegExp): RegexMatch[] {
  return Array.from(text.matchAll(regex)).map(match => {
    const start = match.index
    const end = start + match[0].length
    return { start, end }
  })
}

/**
 * Merge multiple lists of RegexMatch into one.
 * This will merge any overlapping or adjacent RegexMatch.
 */
export function mergeRegexMatches(...matchesLists: RegexMatch[][]): RegexMatch[] {
  // Flatten all matches into a single array
  const allMatches = matchesLists.flat();
  // Sort matches by start index
  allMatches.sort((a, b) => a.start - b.start);
  const merged: RegexMatch[] = [];
  for (const match of allMatches) {
    if (merged.length === 0) {
      merged.push({ ...match });
    } else {
      const last = merged[merged.length - 1];
      // If current match overlaps or touches the last match, merge them
      if (match.start <= last.end) {
        last.end = Math.max(last.end, match.end);
      } else {
        merged.push({ ...match });
      }
    }
  }
  return merged;
}


/**
 * Merge two lists of RegexMatch into one while keeping a reference to the original RegexMatch list
 * that got the match as an annotation.
 * 
 * If we use getRegexMatches more that once with different RegExp, we will end with overlapping
 * matches. For example:
 *   a = [{4, 11}, {23, 30}]
 *   b = [{4,  8}, {23, 27}]
 * 
 * ---AAAAAAAA-----------AAAAAAAA------
 * ---BBBBB--------------BBBBB---------
 * 
 * If we assume C is A + B, we get this as the result:
 * 
 * ---CCCCCAAA-----------CCCCCAAA------
 * result = [{ 3, 8, ['A', 'B'] }, { 8, 11, ['A'] }, { 22, 27, ['A', 'B'] }, { 27, 30, ['A'] }]
 * 
 */
export function mergeRegexMatchesWithAnnotation(
  annotationA: string,
  matchesA: RegexMatch[],
  annotationB: string,
  matchesB: RegexMatch[]
): AnnotatedRegexMatch[] {

  // Check if both are empty
  if (matchesA.length === 0 && matchesB.length === 0) return [];

  // We could also check if one of them is empty and return the other one but we have
  // a final step that "joins" adjacent matches of the same type. 
  // This "join" also works when those consecutive matches are coming from just one 
  // array, so we want to keep that step.

  // Create a Set of breakpoints
  const points = Array.from(
    new Set([
      // Add each start and end values into the Set
      ...matchesA.flatMap(r => [r.start, r.end]),
      ...matchesB.flatMap(r => [r.start, r.end])
    ])
  ).sort((x, y) => x - y);

  const result: AnnotatedRegexMatch[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    // Get a pair of breakpoints
    const start = points[i];
    const end = points[i + 1];

    // Check if this breakpoint pair overlaps with any match from the RegexMatch arrays
    const inA = matchesA.some(r => start >= r.start && end <= r.end);
    const inB = matchesB.some(r => start >= r.start && end <= r.end);

    // If it doesn't. Skip.
    if (!inA && !inB) continue;

    // Store which RegexMatch array had an overlap with our breakpoint pair
    const types: string[] = []
    if (inA) types.push(annotationA)
    if (inB) types.push(annotationB)

    // Merge with previous if same type
    const last = result[result.length - 1];
    if (last && arraysHaveSameElements(last.types, types) && last.end === start) {
      last.end = end;
    } else {
      result.push({ start, end, types });
    }
  }
  return result;
}


