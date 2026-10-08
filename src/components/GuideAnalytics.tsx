'use client'
import { useEffect } from 'react'

/**
 * Anonymous guide analytics. Posts what runners do on a guide to the dashboard
 * hub (api/routers/us_guides.py in hpiening/motiv-dashboard-hub), which stores it
 * in BigQuery for hub.motivsports.com/us-guide-analytics.
 *
 * The SAME file lives in the Motiv US guides repo (hpiening/motiv-race-guides);
 * keep the two copies in step.
 *
 * What is sent: guide views (with referrer host, utm_* tags and a device class),
 * sections scrolled into view, link/button clicks, nav jumps, FAQs opened, search
 * terms, and on leaving, how far down the page the reader got and for how long.
 *
 * What is NOT sent: anything that identifies a runner. The US guides are not
 * personalised, so there is nothing to tie a visit to a person, and no name,
 * email, IP or user agent is stored. `vid` is a random id this browser makes up
 * (localStorage) so repeat visits count once; `sid` is per tab.
 *
 * Template-agnostic on purpose: it reads the DOM rather than any template's
 * props, so all five engines (surf-city, lbm, scruz, sav, mal) and any future one
 * report the same way. A section's name is its `data-search-section`, else its
 * first heading, else its id.
 *
 * Never runs in /edit (that is the team, not runners), on localhost, under
 * automation (navigator.webdriver — our own verification screenshots), or when
 * the browser has opted out with ?notrack=1 (remembered).
 */

const ENDPOINT = 'https://hub.motivsports.com/api/guides/track'
const FLUSH_MS = 5000

function rid() {
  const a = new Uint8Array(12)
  crypto.getRandomValues(a)
  return Array.from(a, b => b.toString(36).padStart(2, '0')).join('').slice(0, 20)
}

function stored(store: Storage | undefined, key: string): string {
  try {
    if (!store) return rid()
    let v = store.getItem(key)
    if (!v) {
      v = rid()
      store.setItem(key, v)
    }
    return v
  } catch {
    return rid()
  }
}

function text(el: Element | null, n = 120): string {
  if (!el) return ''
  // textContent of a copy with the decorative bits removed: innerText would
  // return CSS-uppercased text ("WHAT TO BRING?") and the accordion's aria-hidden
  // "+" marker, so the same question would read differently per template.
  let raw = el.getAttribute('aria-label') || ''
  if (!raw) {
    const c = el.cloneNode(true) as Element
    c.querySelectorAll('[aria-hidden="true"], [aria-hidden=""], svg, script, style').forEach(n => n.remove())
    raw = c.textContent || ''
  }
  // Trailing accordion markers (+ × −) that a template didn't mark aria-hidden.
  const t = raw.replace(/\s+/g, ' ').trim().replace(/\s*[+×−–]+$/, '')
  if (t) return t.slice(0, n)
  const img = el.querySelector('img')
  return (img?.getAttribute('alt') || '').slice(0, n)
}

const SECTION_SEL = '[data-search-section], section[id]'

function sectionName(el: Element | null): string {
  const s = el?.closest(SECTION_SEL)
  if (!s) return ''
  const named = s.getAttribute('data-search-section')
  if (named) return named.slice(0, 80)
  const h = s.querySelector('h1, h2, h3')
  return (text(h, 80) || s.id || '').slice(0, 80)
}

function deviceOf(w: number) {
  return w < 768 ? 'mobile' : w < 1100 ? 'tablet' : 'desktop'
}

export default function GuideAnalytics({ slug }: { slug: string }) {
  useEffect(() => {
    const loc = window.location
    const params = new URLSearchParams(loc.search)
    try {
      if (params.get('notrack') === '1') localStorage.setItem('rdg-notrack', '1')
      if (params.get('notrack') === '0') localStorage.removeItem('rdg-notrack')
      if (localStorage.getItem('rdg-notrack') === '1') return
    } catch { /* storage blocked: still fine to track anonymously */ }
    if (loc.pathname.startsWith('/edit')) return
    if (/^(localhost|127\.|\[::1\])/.test(loc.hostname)) return
    if (navigator.webdriver) return

    const vw = window.innerWidth
    let ref = ''
    try {
      const r = document.referrer ? new URL(document.referrer).hostname : ''
      ref = r && r !== loc.hostname ? r : ''
    } catch { /* malformed referrer */ }

    const base = {
      host: loc.hostname,
      slug,
      vid: stored(typeof localStorage !== 'undefined' ? localStorage : undefined, 'rdg-vid'),
      sid: stored(typeof sessionStorage !== 'undefined' ? sessionStorage : undefined, 'rdg-sid'),
      device: deviceOf(vw),
      vw,
      ref,
      utm_source: params.get('utm_source') || undefined,
      utm_medium: params.get('utm_medium') || undefined,
      utm_campaign: params.get('utm_campaign') || undefined,
    }

    type Ev = { event: string; label?: string; target?: string; section?: string; kind?: string; value?: number }
    let queue: Ev[] = []
    const flush = () => {
      if (!queue.length) return
      const body = JSON.stringify({ ...base, events: queue.splice(0, 40) })
      try {
        const blob = new Blob([body], { type: 'text/plain' })
        if (!(navigator.sendBeacon && navigator.sendBeacon(ENDPOINT, blob))) {
          fetch(ENDPOINT, { method: 'POST', body, keepalive: true, mode: 'no-cors', headers: { 'Content-Type': 'text/plain' } }).catch(() => {})
        }
      } catch { /* analytics must never break the guide */ }
      if (queue.length) flush()
    }
    const push = (e: Ev) => {
      queue.push(e)
      if (queue.length >= 30) flush()
    }

    push({ event: 'view' })
    const timer = window.setInterval(flush, FLUSH_MS)

    // ── sections scrolled into view (once each per page view) ──
    const seen = new Set<string>()
    const io = 'IntersectionObserver' in window
      ? new IntersectionObserver(entries => {
          for (const en of entries) {
            if (!en.isIntersecting) continue
            const name = sectionName(en.target)
            if (name && !seen.has(name)) {
              seen.add(name)
              push({ event: 'section', label: name })
            }
            io?.unobserve(en.target)
          }
        }, { threshold: 0.35 })
      : null
    const observe = () => {
      document.querySelectorAll(SECTION_SEL).forEach(el => {
        // Only outermost sections: a nested <section> would double-count.
        if (el.parentElement?.closest(SECTION_SEL)) return
        io?.observe(el)
      })
    }
    observe()

    // ── clicks: links, buttons, nav ──
    const onClick = (ev: MouseEvent) => {
      const t = ev.target as Element | null
      const el = t?.closest('a, button')
      if (!el || el.closest('summary')) return // <details> accordions report as 'faq' below
      // Button-driven accordions (the VR FAQs) say whether they are open with
      // aria-expanded: a click on a collapsed one is an open, a click on an
      // expanded one is a close and is not counted.
      const exp = el.getAttribute('aria-expanded')
      if (exp !== null && !el.closest('nav')) {
        if (exp === 'false') push({ event: 'faq', label: text(el, 160), section: sectionName(el) })
        return
      }
      const href = el.tagName === 'A' ? (el as HTMLAnchorElement).getAttribute('href') || '' : ''
      const label = text(el)
      if (el.closest('nav')) {
        if (label) push({ event: 'nav', label })
        return
      }
      const section = sectionName(el)
      let kind = 'button'
      if (href) {
        let abs = href
        try { abs = new URL(href, loc.href).href } catch { /* keep raw */ }
        if (/\/(partners)\b|partner/i.test(section) || el.closest('#partners')) kind = 'partner'
        else if (el.hasAttribute('download') || /\.(pdf|png|jpe?g|webp)(\?|$)/i.test(abs)) kind = 'download'
        else if (/google\.[a-z.]+\/maps|maps\.app\.goo\.gl|maps\.apple/i.test(abs)) kind = 'map'
        else if (/shop\.motivsports\.com|\/shop|itab/i.test(abs)) kind = 'shop'
        else {
          let sameHost = href.startsWith('#')
          try { sameHost = sameHost || new URL(abs).hostname === loc.hostname } catch { /* malformed */ }
          kind = sameHost ? 'internal' : 'external'
        }
        push({ event: 'click', label, target: abs.slice(0, 400), section, kind })
      } else if (label) {
        push({ event: 'click', label, section, kind })
      }
    }
    document.addEventListener('click', onClick, true)

    // ── accordions opened (FAQs, course maps, aid stations…) ──
    const onToggle = (ev: Event) => {
      const d = ev.target as HTMLDetailsElement
      if (!(d instanceof HTMLDetailsElement) || !d.open) return
      push({ event: 'faq', label: text(d.querySelector('summary'), 160), section: sectionName(d) })
    }
    document.addEventListener('toggle', onToggle, true)

    // ── search: the term once the runner stops typing ──
    let searchTimer = 0
    let lastSent = ''
    const onInput = (ev: Event) => {
      const i = ev.target as HTMLInputElement
      if (!(i instanceof HTMLInputElement)) return
      window.clearTimeout(searchTimer)
      searchTimer = window.setTimeout(() => {
        const term = i.value.replace(/\s+/g, ' ').trim().slice(0, 60)
        if (term.length >= 2 && term.toLowerCase() !== lastSent) {
          lastSent = term.toLowerCase()
          push({ event: 'search', label: term })
        }
      }, 1500)
    }
    document.addEventListener('input', onInput, true)

    // ── depth + time on page, sent as the page is hidden ──
    const t0 = Date.now()
    let maxDepth = 0
    const onScroll = () => {
      const de = document.documentElement
      const d = Math.round(((window.scrollY + window.innerHeight) / Math.max(1, de.scrollHeight)) * 100)
      if (d > maxDepth) maxDepth = Math.min(100, d)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    let depthSent = false
    const onHide = () => {
      if (document.visibilityState === 'hidden') {
        if (!depthSent) {
          depthSent = true
          push({ event: 'depth', value: maxDepth, label: String(Math.round((Date.now() - t0) / 1000)) })
        }
        flush()
      }
    }
    document.addEventListener('visibilitychange', onHide)
    window.addEventListener('pagehide', onHide)

    return () => {
      flush()
      window.clearInterval(timer)
      io?.disconnect()
      document.removeEventListener('click', onClick, true)
      document.removeEventListener('toggle', onToggle, true)
      document.removeEventListener('input', onInput, true)
      document.removeEventListener('visibilitychange', onHide)
      window.removeEventListener('pagehide', onHide)
      window.removeEventListener('scroll', onScroll)
    }
  }, [slug])

  return null
}
