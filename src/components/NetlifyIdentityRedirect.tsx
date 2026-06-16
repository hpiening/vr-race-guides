'use client'
import Script from 'next/script'

/**
 * Loads the Netlify Identity widget on every page so invite / recovery links
 * (which land on the site root with a #invite_token=... hash) open the signup
 * modal. After a fresh invite/recovery login, send the user to the editor.
 *
 * We only redirect when on the homepage or coming from an invite/recovery link
 * — logins initiated inside /edit are handled by that page itself, so we don't
 * yank the user away mid-flow.
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
              const { pathname, hash } = window.location
              if (pathname === '/' || hash.includes('invite_token') || hash.includes('recovery_token')) {
                document.location.href = '/edit/'
              }
            })
          }
        })
      }}
    />
  )
}
