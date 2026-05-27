import { redirect } from 'next/navigation'

// Root redirects to grand-teton as the first live event.
// When more events are added, this can become an event index page.
export default function Home() {
  redirect('/grand-teton')
}
