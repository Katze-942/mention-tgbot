/** Adapts the text to HTML markup, for example, replacing the characters "<" and ">" with "&lt;" and "&gt;" */
function adaptTextToHTML (text: string): string {
  return text.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

export default adaptTextToHTML
