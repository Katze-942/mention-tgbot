/**
 * Finds the first match.
 * @param texts Array of text.
 * @param search What to look for a match.
 * @example ```ts
 * findFirstMatch('I use Arch BTW'.split(' '), ['Arch', 'BTW']) // Arch
 * ```
 */
function findFirstMatch (texts: string[], search: string[]): string | undefined {
  return texts.find(t => search.includes(t))
}

export default findFirstMatch
