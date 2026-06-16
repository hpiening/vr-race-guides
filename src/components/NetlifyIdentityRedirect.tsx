'use client'
import Script from 'next/script'

/**
 * Loads the Netlify Identity widget on every page so invite / recovery links
 * (which land on the site root with a #invite_token=... hash) open the
 * signup modal. After the user logs in, send them to the CMS at /admin/.
 *
 * Without this, invite links just show the site and nothing happens — the
 * widget only existed on /admin/index.html.
 */
export default function NetlifyIdentityRedirect() {
  return (
    <Script
      src="https://identity.netlify.com/v1/netlify-identity-widget.js"
      onLoad={() => {
        const identity = (window as unknown as { netlifyIdentity?: any }).netlifyIdentity
        if (!identity) return
        identity.on('init', (user: unknown) => {
          if (!user) {
            identity.on('login', () => {
              document.location.href = '/admin/'
            })
          }
        })
      }}
    />
  )
}
