'use client'
import { useEffect, useState } from 'react'
import { EventData } from '@/types/event'
import { useEditOptional } from '@/lib/editContext'
import EditableText from './edit/EditableText'
import EditableUrl from './edit/EditableUrl'

/**
 * Race-weekend announcement banner. Top-of-page (scrolls away with the content),
 * toggled on/off and edited entirely from /edit via the `alert` block on the
 * event JSON. Three colour levels: info (brand blue), weather (amber), urgent
 * (red). Dismissible on the public site (per browser session, keyed to the
 * message so a NEW update reappears). Renders nothing on the public site when
 * absent/disabled; in the editor it always shows so it can be turned on.
 */

type AlertData = NonNullable<EventData['alert']>
const LEVELS = ['info', 'weather', 'urgent'] as const
type Level = (typeof LEVELS)[number]

const STYLES: Record<Level, { bg: string; fg: string; sub: string; icon: string; label: string }> = {
  info:    { bg: 'var(--vr-sky)', fg: '#1C1F18', sub: 'rgba(28,31,24,0.72)',  icon: 'ℹ', label: 'Info' },
  weather: { bg: '#E0A82E',       fg: '#2B2E27', sub: 'rgba(43,46,39,0.72)',  icon: '⚠', label: 'Weather' },
  urgent:  { bg: '#C0392B',       fg: '#FFFFFF', sub: 'rgba(255,255,255,0.8)', icon: '⛔', label: 'Urgent' },
}

function hash(s: string): string {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return String(h)
}

type Props = { alert?: EventData['alert']; slug: string }

export default function AlertBanner({ alert, slug }: Props) {
  const ctx = useEditOptional()
  const editing = !!ctx?.editing
  const a: AlertData = alert ?? { enabled: false, message: '' }
  const level: Level = LEVELS.includes(a.level as Level) ? (a.level as Level) : 'info'
  const s = STYLES[level]

  // Public dismissal (per browser session, keyed to the message content).
  const key = `vr-alert:${slug}:${hash(`${a.title ?? ''}|${a.message}|${level}`)}`
  const [dismissed, setDismissed] = useState(false)
  useEffect(() => {
    if (editing) return
    try { setDismissed(sessionStorage.getItem(key) === '1') } catch {}
  }, [key, editing])

  // Public site: render only when enabled and not dismissed.
  if (!editing && (!a.enabled || dismissed)) return null

  // Editor, banner OFF: a slim placeholder so it can be switched on.
  if (editing && !a.enabled) {
    return (
      <div className="print:hidden px-6 md:px-12 py-2.5 bg-vr-forest/5 border-b border-dashed border-vr-forest/25 flex items-center justify-center gap-3">
        <span className="font-micro text-xs tracking-[0.14em] uppercase text-vr-forest/55">Race-weekend banner — off</span>
        <button
          type="button"
          onClick={() => ctx!.setValues([['alert.enabled', true], ...(a.level ? [] : [['alert.level', 'info'] as [string, unknown]])])}
          className="font-label text-xs tracking-[0.12em] uppercase px-3 py-1 rounded-full bg-vr-forest text-vr-cream hover:opacity-90"
        >
          Turn on
        </button>
      </div>
    )
  }

  return (
    <div className="print:hidden w-full" style={{ background: s.bg, color: s.fg }}>
      <div className="max-w-[1180px] mx-auto px-6 md:px-12 py-3.5 flex items-start gap-3.5">
        <span aria-hidden="true" className="text-lg leading-none mt-0.5 shrink-0">{s.icon}</span>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
            <EditableText
              as="span"
              className="font-heading uppercase tracking-[0.04em] text-[13px]"
              value={a.title ?? ''}
              path="alert.title"
              placeholder="Race weekend update"
            />
            {(editing || a.updated) && (
              <span style={{ color: s.sub }}>
                <EditableText
                  as="span"
                  className="font-micro uppercase text-[11px] tracking-[0.1em]"
                  value={a.updated ?? ''}
                  path="alert.updated"
                  placeholder="Updated Sat 6:15 AM MT"
                />
              </span>
            )}
          </div>
          <EditableText
            as="div"
            className="font-body text-sm leading-snug mt-0.5 whitespace-pre-line"
            value={a.message}
            path="alert.message"
            placeholder="Type your race-weekend update…"
          />
          {editing ? (
            <div className="mt-1"><EditableUrl path="alert.linkUrl" label="Link URL (optional)" /></div>
          ) : a.linkUrl ? (
            <a
              href={a.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-1 font-label text-xs tracking-[0.12em] uppercase underline underline-offset-2"
              style={{ color: s.fg }}
            >
              {a.linkLabel || 'More info'} ↗
            </a>
          ) : null}
          {editing && (
            <EditableText
              as="div"
              className="font-micro text-[11px] mt-1 opacity-80"
              value={a.linkLabel ?? ''}
              path="alert.linkLabel"
              placeholder="Link label (optional)"
            />
          )}
        </div>

        {/* Editor controls: level cycle + turn off. Public: dismiss ×. */}
        {editing ? (
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => ctx!.setValue('alert.level', LEVELS[(LEVELS.indexOf(level) + 1) % LEVELS.length])}
              title="Change banner level"
              className="font-label text-[11px] tracking-[0.1em] uppercase px-3 py-1 rounded-full border"
              style={{ borderColor: s.fg, color: s.fg }}
            >
              {s.label} ↻
            </button>
            <button
              type="button"
              onClick={() => ctx!.setValue('alert.enabled', false)}
              title="Turn banner off"
              className="font-label text-[11px] tracking-[0.1em] uppercase px-3 py-1 rounded-full border"
              style={{ borderColor: s.fg, color: s.fg }}
            >
              Turn off
            </button>
          </div>
        ) : (
          <button
            type="button"
            aria-label="Dismiss update"
            onClick={() => { try { sessionStorage.setItem(key, '1') } catch {}; setDismissed(true) }}
            className="shrink-0 text-xl leading-none px-1 opacity-70 hover:opacity-100"
            style={{ color: s.fg }}
          >
            ×
          </button>
        )}
      </div>
    </div>
  )
}
