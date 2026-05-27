'use client'
import { useEffect } from 'react'
import Script from 'next/script'

declare global {
  interface Window {
    netlifyIdentity: {
      on: (event: string, cb: (user?: unknown) => void) => void
    }
  }
}

export default function Home() {
  useEffect(() => {
    const hash = window.location.hash
    const hasToken =
      hash.includes('confirmation_token') ||
      hash.includes('invite_token') ||
      hash.includes('recovery_token') ||
      hash.includes('access_token')

    if (!hasToken) {
      window.location.replace('/grand-teton/')
    }
  }, [])

  return (
    <Script
      src="https://identity.netlify.com/v1/netlify-identity-widget.js"
      strategy="afterInteractive"
      onLoad={() => {
        if (window.netlifyIdentity) {
          window.netlifyIdentity.on('init', (user) => {
            if (!user) {
              window.netlifyIdentity.on('login', () => {
                document.location.href = '/admin/'
              })
            }
          })
        }
      }}
    />
  )
}
