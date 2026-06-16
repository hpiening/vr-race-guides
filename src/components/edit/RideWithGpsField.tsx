'use client'
import { useEditOptional } from '@/lib/editContext'

/**
 * Editable RideWithGPS route link. Editors paste a route URL (e.g.
 * https://ridewithgps.com/routes/51714103); we store it as the "View Full
 * Route" link AND rebuild the embedded map URL from the route id, so the
 * displayed map updates to match. `itemPath` points at the course/distance
 * object (which has `mapUrl` + `embedUrl`).
 */
export default function RideWithGpsField({ itemPath }: { itemPath: string }) {
  const ctx = useEditOptional()
  if (!ctx?.editing) return null

  const mapUrl = (ctx.value(`${itemPath}.mapUrl`) as string) ?? ''

  const onChange = (url: string) => {
    const m = url.match(/routes\/(\d+)/) || url.match(/[?&]id=(\d+)/) || url.match(/(\d{5,})/)
    const id = m?.[1]
    const entries: [string, unknown][] = [[`${itemPath}.mapUrl`, url]]
    if (id) {
      entries.push([`${itemPath}.embedUrl`, `https://ridewithgps.com/embeds?type=route&id=${id}&metricUnits=true&sampleGraph=true`])
    }
    ctx.setValues(entries)
  }

  return (
    <div className="px-5 py-3 border-t border-current/10">
      <label className="font-micro text-xs tracking-widest uppercase opacity-50 block mb-1">RideWithGPS route link</label>
      <input
        value={mapUrl}
        onChange={e => onChange(e.target.value)}
        placeholder="https://ridewithgps.com/routes/12345"
        className="editable-field w-full text-sm"
        style={{ font: 'inherit', color: 'inherit', background: 'transparent', padding: '4px 6px' }}
      />
      <p className="font-micro text-[10px] opacity-40 mt-1">The map above updates from this link.</p>
    </div>
  )
}
