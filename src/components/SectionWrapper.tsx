interface SectionWrapperProps {
  id: string
  label: string
  children: React.ReactNode
  dark?: boolean
}

export default function SectionWrapper({ id, label, children, dark }: SectionWrapperProps) {
  return (
    <section
      id={id}
      className={`py-16 md:py-24 px-6 md:px-12 ${dark ? 'bg-vr-forest text-vr-cream' : 'bg-vr-white text-vr-forest'}`}
    >
      <div className="max-w-4xl mx-auto">
        <p className={`font-micro text-xs tracking-[0.25em] uppercase mb-2 ${dark ? 'text-vr-cream/50' : 'text-vr-mid'}`}>
          {label}
        </p>
        {children}
      </div>
    </section>
  )
}
