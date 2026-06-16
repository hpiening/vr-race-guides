'use client'
import { createContext, useContext, useCallback, ReactNode } from 'react'

/**
 * Edit state for the inline guide editor.
 *
 * The /edit page owns the working `data` and passes it both to the section
 * components (as their normal props, for display) and to this provider (for
 * path-based reads/writes). Components write back by dotted path:
 *   "name", "tagline", "sections.faqs.items.3.question"
 *
 * Components rendered OUTSIDE a provider (the public guide pages) get `null`
 * from useEditOptional() and stay completely read-only — editing support never
 * affects the live site.
 */

type EditCtx = {
  editing: boolean
  value: (path: string) => unknown
  setValue: (path: string, v: unknown) => void
  setValues: (entries: [string, unknown][]) => void
  listAdd: (path: string, item: unknown) => void
  listRemove: (path: string, index: number) => void
  listMove: (path: string, index: number, dir: -1 | 1) => void
}

const Ctx = createContext<EditCtx | null>(null)

export function useEditOptional(): EditCtx | null {
  return useContext(Ctx)
}

// ── immutable path helpers ───────────────────────────────────────────────
function parse(path: string): (string | number)[] {
  return path.split('.').map(seg => (/^\d+$/.test(seg) ? Number(seg) : seg))
}

function getIn(obj: any, keys: (string | number)[]): any {
  return keys.reduce((acc, k) => (acc == null ? acc : acc[k]), obj)
}

function setIn(obj: any, keys: (string | number)[], value: any): any {
  if (keys.length === 0) return value
  const [k, ...rest] = keys
  const clone = Array.isArray(obj) ? [...obj] : { ...(obj ?? {}) }
  clone[k] = setIn(obj?.[k], rest, value)
  return clone
}

export function EditProvider({
  data,
  editing,
  onChange,
  children,
}: {
  data: any
  editing: boolean
  onChange: (next: any) => void
  children: ReactNode
}) {
  const value = useCallback((path: string) => getIn(data, parse(path)), [data])

  const setValue = useCallback(
    (path: string, v: unknown) => onChange(setIn(data, parse(path), v)),
    [data, onChange],
  )

  // Apply several path/value writes in one update (avoids stale-data clobbering
  // when two related fields must change together, e.g. a route link + its embed).
  const setValues = useCallback(
    (entries: [string, unknown][]) => {
      let next = data
      for (const [path, v] of entries) next = setIn(next, parse(path), v)
      onChange(next)
    },
    [data, onChange],
  )

  const listAdd = useCallback(
    (path: string, item: unknown) => {
      const keys = parse(path)
      const arr = (getIn(data, keys) as unknown[]) ?? []
      onChange(setIn(data, keys, [...arr, item]))
    },
    [data, onChange],
  )

  const listRemove = useCallback(
    (path: string, index: number) => {
      const keys = parse(path)
      const arr = ((getIn(data, keys) as unknown[]) ?? []).slice()
      arr.splice(index, 1)
      onChange(setIn(data, keys, arr))
    },
    [data, onChange],
  )

  const listMove = useCallback(
    (path: string, index: number, dir: -1 | 1) => {
      const keys = parse(path)
      const arr = ((getIn(data, keys) as unknown[]) ?? []).slice()
      const target = index + dir
      if (target < 0 || target >= arr.length) return
      ;[arr[index], arr[target]] = [arr[target], arr[index]]
      onChange(setIn(data, keys, arr))
    },
    [data, onChange],
  )

  return (
    <Ctx.Provider value={{ editing, value, setValue, setValues, listAdd, listRemove, listMove }}>
      {children}
    </Ctx.Provider>
  )
}
