'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      aria-label="Export as PDF"
      className="
        fixed bottom-6 right-6 z-50
        flex items-center gap-2
        bg-vr-forest text-vr-cream
        font-label text-xs tracking-[0.15em] uppercase
        px-4 py-3 rounded-full shadow-lg
        hover:bg-vr-deep transition-colors
        print:hidden
      "
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M2.5 9.5V11.5H11.5V9.5" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M7 1.5V8.5M7 8.5L4.5 6M7 8.5L9.5 6" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
      Export PDF
    </button>
  )
}
