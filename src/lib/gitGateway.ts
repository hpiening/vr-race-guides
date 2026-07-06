/**
 * Minimal Git Gateway client.
 *
 * Git Gateway (enabled on the Netlify site) proxies the GitHub contents API and
 * authenticates with the logged-in Netlify Identity user's JWT. This lets the
 * static site read and commit a guide's JSON with no server of our own — the
 * same mechanism the CMS uses under the hood.
 *
 * Endpoints (same-origin):
 *   GET  /.netlify/git/github/contents/<path>?ref=<branch>
 *   PUT  /.netlify/git/github/contents/<path>   { message, content(base64), sha, branch }
 */

const BRANCH = 'main'
const BASE = '/.netlify/git/github/contents'

type NetlifyUser = { jwt: () => Promise<string>; email?: string }
type NetlifyIdentity = {
  currentUser: () => NetlifyUser | null
  on: (event: string, cb: (user?: NetlifyUser) => void) => void
  open: (tab?: string) => void
  close: () => void
  logout: () => void
  init: (opts?: Record<string, unknown>) => void
}

export function getIdentity(): NetlifyIdentity | null {
  if (typeof window === 'undefined') return null
  return (window as unknown as { netlifyIdentity?: NetlifyIdentity }).netlifyIdentity ?? null
}

async function authHeader(): Promise<Record<string, string>> {
  const identity = getIdentity()
  const user = identity?.currentUser()
  if (!user) throw new Error('Not logged in')
  const token = await user.jwt() // refreshes if needed
  return { Authorization: `Bearer ${token}` }
}

/**
 * Upload an image file into the repo (public/images/uploads/) via Git Gateway
 * and return its public path (/images/uploads/…). New file each time (timestamped
 * name), so no sha needed. The guide's JSON still needs saving afterwards to point
 * at the returned path.
 */
export async function uploadImage(file: File): Promise<string> {
  const headers = { ...(await authHeader()), 'Content-Type': 'application/json' }
  const bytes = new Uint8Array(await file.arrayBuffer())
  let binary = ''
  bytes.forEach(b => { binary += String.fromCharCode(b) })
  const base64 = btoa(binary)
  const clean = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')
  const name = `${Date.now()}-${clean || 'image'}`
  const res = await fetch(`${BASE}/public/images/uploads/${name}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify({ message: `Upload image ${name}`, content: base64, branch: BRANCH }),
  })
  if (!res.ok) throw new Error(`Upload failed (${res.status})`)
  return `/images/uploads/${name}`
}

/** UTF-8 safe base64 encode (btoa alone mangles non-ASCII). */
function toBase64(str: string): string {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  bytes.forEach(b => { binary += String.fromCharCode(b) })
  return btoa(binary)
}

/** UTF-8 safe base64 decode. */
function fromBase64(b64: string): string {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = Uint8Array.from(binary, c => c.charCodeAt(0))
  return new TextDecoder().decode(bytes)
}

export type LoadedFile<T> = { data: T; sha: string }

/** Read and parse a JSON file from the repo, returning its content + git sha. */
export async function readJson<T>(path: string): Promise<LoadedFile<T>> {
  const headers = await authHeader()
  const res = await fetch(`${BASE}/${path}?ref=${BRANCH}`, { headers })
  if (!res.ok) throw new Error(`Failed to load ${path} (${res.status})`)
  const json = await res.json()
  const text = fromBase64(json.content)
  return { data: JSON.parse(text) as T, sha: json.sha }
}

/**
 * Commit an updated JSON file. `sha` must be the sha from the last read; if it
 * no longer matches (someone else committed in between) GitHub returns 409 and
 * we surface a clear conflict error so the editor can reload.
 */
export async function commitJson(
  path: string,
  data: unknown,
  sha: string,
  message: string,
): Promise<{ sha: string }> {
  const headers = { ...(await authHeader()), 'Content-Type': 'application/json' }
  const body = JSON.stringify({
    message,
    content: toBase64(JSON.stringify(data, null, 2) + '\n'),
    sha,
    branch: BRANCH,
  })
  const res = await fetch(`${BASE}/${path}`, { method: 'PUT', headers, body })
  if (res.status === 409) {
    throw new Error('This guide changed since you opened it. Please reload before saving.')
  }
  if (!res.ok) throw new Error(`Save failed (${res.status})`)
  const json = await res.json()
  return { sha: json.content?.sha ?? sha }
}
