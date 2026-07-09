/**
 * Minimal, XSS-safe inline Markdown for body copy: links and bold only.
 * Editors write:
 *   [runner drop-off](#race-morning)   → jump to a section (anchor)
 *   [register here](https://…)         → external link (opens in new tab)
 *   **bold text**
 *
 * We escape all HTML first, then re-introduce only <a> and <strong>, so editor
 * input can never inject markup. Newlines are preserved by the container's
 * `whitespace-pre-line`.
 */

const MD_SYNTAX = /\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*|\*[^*\n]+\*|_[^_\n]+_/

/** True if the text uses link/bold/italic syntax and should be rendered as HTML. */
export function hasMarkdown(src: string): boolean {
  return MD_SYNTAX.test(src)
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

export function renderMarkdown(src: string): string {
  let s = escapeHtml(src)
  // [text](url) — allow only http(s), #anchor, root-relative, or mailto
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text: string, url: string) => {
    const safe = /^(https?:\/\/|#|\/|mailto:)/.test(url) ? url : '#'
    const external = /^https?:\/\//.test(safe)
    const attrs = external ? ' target="_blank" rel="noopener noreferrer"' : ''
    return `<a href="${safe}"${attrs} class="tl-link">${text}</a>`
  })
  // **bold** (before italic so the double-asterisks aren't caught by it)
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  // *italic* or _italic_
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>')
  s = s.replace(/_([^_\n]+)_/g, '<em>$1</em>')
  return s
}
