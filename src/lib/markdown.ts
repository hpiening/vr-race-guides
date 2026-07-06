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

const LINK_OR_BOLD = /\[[^\]]+\]\([^)\s]+\)|\*\*[^*]+\*\*/

/** True if the text uses link or bold syntax and should be rendered as HTML. */
export function hasMarkdown(src: string): boolean {
  return LINK_OR_BOLD.test(src)
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
  // **bold**
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
  return s
}
