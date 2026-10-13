export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-8 flex max-w-2xl flex-col gap-2">
      <div className="flex items-center gap-2" aria-hidden="true">
        <span className="h-px w-8 bg-primary" />
        <span className="size-1.5 rounded-full bg-primary" />
      </div>
      <h2 className="text-balance font-serif text-3xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      {subtitle && <p className="text-pretty leading-relaxed text-muted-foreground">{subtitle}</p>}
    </div>
  )
}
