"use client"

import { Sprout } from "lucide-react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import type { Lang } from "@/lib/eco-data"
import { useEco } from "./eco-provider"

const LANGS: { value: Lang; label: string }[] = [
  { value: "ru", label: "RU" },
  { value: "kk", label: "KZ" },
  { value: "en", label: "EN" },
]

export function SiteHeader() {
  const { t, lang, setLang } = useEco()
  const links = [
    ["overview", t.nav.overview],
    ["map", t.nav.map],
    ["trends", t.nav.trends],
    ["analysis", t.nav.analysis],
    ["facilities", t.nav.facilities],
    ["about", t.nav.about],
  ] as const

  return (
    <header className="sticky top-0 z-[1100] border-b bg-background/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3 md:px-6">
        <a href="#top" className="flex shrink-0 items-center gap-2" aria-label="EcoPavlodar">
          <span className="flex size-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Sprout className="size-4" aria-hidden="true" />
          </span>
          <span className="font-serif text-lg font-semibold tracking-tight">
            Eco<span className="text-primary">Pavlodar</span>
          </span>
        </a>

        <nav aria-label="Main" className="hidden flex-1 justify-center md:flex">
          <ul className="flex items-center gap-1">
            {links.map(([id, label]) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-secondary hover:text-secondary-foreground"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <ToggleGroup
          aria-label={t.langLabel}
          value={[lang]}
          onValueChange={(v) => v[0] && setLang(v[0] as Lang)}
          variant="outline"
          size="sm"
          className="ml-auto md:ml-0"
        >
          {LANGS.map((l) => (
            <ToggleGroupItem key={l.value} value={l.value} aria-label={l.label}>
              {l.label}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
      <nav aria-label="Sections" className="border-t md:hidden">
        <ul className="flex gap-1 overflow-x-auto px-4 py-2">
          {links.map(([id, label]) => (
            <li key={id} className="shrink-0">
              <a href={`#${id}`} className="rounded-full px-3 py-1 text-sm text-muted-foreground hover:bg-secondary">
                {label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  )
}
