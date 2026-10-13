"use client"

import { ExternalLink, Leaf, Sprout } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useEco } from "./eco-provider"
import { SectionHeading } from "./section-heading"

export function About() {
  const { t } = useEco()
  const sources = [
    { name: "Open-Meteo Forecast API", href: "https://open-meteo.com/en/docs", note: t.about.sourceNotes.weather },
    {
      name: "Open-Meteo Air Quality (CAMS)",
      href: "https://open-meteo.com/en/docs/air-quality-api",
      note: t.about.sourceNotes.air,
    },
    { name: "WHO Air Quality Guidelines 2021", href: "https://www.who.int/publications/i/item/9789240034228", note: "PM2.5, PM10, NO2, SO2, O3, CO" },
    { name: "OpenStreetMap", href: "https://www.openstreetmap.org/copyright", note: t.about.sourceNotes.tiles },
  ]

  return (
    <section id="about" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <SectionHeading title={t.about.title} subtitle={t.about.subtitle} />
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">{t.about.sources}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col divide-y">
              {sources.map((s) => (
                <li key={s.name} className="py-3 first:pt-0 last:pb-0">
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start justify-between gap-3"
                  >
                    <span className="flex flex-col">
                      <span className="font-medium group-hover:text-primary">{s.name}</span>
                      <span className="text-sm text-muted-foreground">{s.note}</span>
                    </span>
                    <ExternalLink className="mt-1 size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardContent>
            <Accordion defaultValue={["limits"]}>
              <AccordionItem value="limits">
                <AccordionTrigger>{t.about.limitations}</AccordionTrigger>
                <AccordionContent>
                  <ul className="flex flex-col gap-2">
                    {t.about.limitationsList.map((l) => (
                      <li key={l} className="flex gap-2">
                        <Leaf className="mt-1 size-3.5 shrink-0 text-primary" aria-hidden="true" />
                        <span>{l}</span>
                      </li>
                    ))}
                  </ul>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="method">
                <AccordionTrigger>{t.about.methodology}</AccordionTrigger>
                <AccordionContent>
                  <p className="leading-relaxed">{t.about.methodologyText}</p>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export function SiteFooter() {
  const { t } = useEco()
  return (
    <footer className="border-t bg-foreground text-background">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-sm md:flex-row md:items-center md:justify-between md:px-6">
        <span className="flex items-center gap-2">
          <Sprout className="size-4" aria-hidden="true" />
          {t.footer}
        </span>
        <span className="text-background/60">Open-Meteo · CAMS · OpenStreetMap</span>
      </div>
    </footer>
  )
}
