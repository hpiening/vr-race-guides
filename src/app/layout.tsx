import type { Metadata } from 'next'
import '@/styles/globals.css'
import NetlifyIdentityRedirect from '@/components/NetlifyIdentityRedirect'

export const metadata: Metadata = {
  title: 'Race Day Guide',
  description: 'Everything you need for race day — schedule, expo, course info, and more.',
  icons: {
    icon: [
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <NetlifyIdentityRedirect />
      </body>
    </html>
  )
}
