"use client"

import { useCompletion } from "@ai-sdk/react"
import { Sparkles, Square } from "lucide-react"
import { useState } from "react"
import { Streamdown } from "streamdown"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { fill } from "@/lib/i18n"
import { DateRangeControl } from "./date-range-control"
import { useEco } from "./eco-provider"
import { SectionHeading } from "./section-heading"

const FOCUS_KEYS = ["overview", "health", "industry", "seasonal", "today"] as const
type FocusKey = (typeof FOCUS_KEYS)[number]

export function AiAnalysis() {
  const { t, lang, city, range } = useEco()
  const [focus, setFocus] = useState<FocusKey>("overview")
  const [usedRange, setUsedRange] = useState<{ city: string; from: string; to: string } | null>(null)
  const { completion, input, setInput, complete, isLoading, stop, error } = useCompletion({
    api: "/api/analysis",
    streamProtocol: "text",
  })

  const run = () => {
    setUsedRange({ city: city.name[lang], from: range.start, to: range.end })
    complete(input, { body: { cityId: city.id, start: range.start, end: range.end, focus, lang } })
  }

  return (
    <section id="analysis" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <SectionHeading title={t.analysis.title} subtitle={t.analysis.subtitle} />

      <DateRangeControl className="mb-4" />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.6fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">{city.name[lang]}</CardTitle>
            <CardDescription>
              {range.start} — {range.end}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              className="flex flex-col gap-5"
              onSubmit={(e) => {
                e.preventDefault()
                if (!isLoading) run()
              }}
            >
              <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-sm font-medium">{t.analysis.focus}</legend>
                <ToggleGroup
                  aria-label={t.analysis.focus}
                  value={[focus]}
                  onValueChange={(v) => v[0] && setFocus(v[0] as FocusKey)}
                  variant="outline"
                  className="flex-wrap justify-start"
                >
                  {FOCUS_KEYS.map((k) => (
                    <ToggleGroupItem key={k} value={k} className="px-3">
                      {t.analysis.focusOptions[k]}
                    </ToggleGroupItem>
                  ))}
                </ToggleGroup>
              </fieldset>

              <div className="flex flex-col gap-2">
                <label htmlFor="analysis-question" className="text-sm font-medium">
                  {t.analysis.question}
                </label>
                <textarea
                  id="analysis-question"
                  value={input}
                  maxLength={600}
                  rows={4}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key !== "Enter" || e.shiftKey) return
                    if (e.nativeEvent.isComposing || e.keyCode === 229) return
                    e.preventDefault()
                    if (!isLoading) run()
                  }}
                  placeholder={t.analysis.questionPlaceholder}
                  className="min-h-24 w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-xs outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                />
              </div>

              {isLoading ? (
                <Button type="button" variant="outline" onClick={stop}>
                  <Square data-icon="inline-start" aria-hidden="true" />
                  {t.analysis.stop}
                </Button>
              ) : (
                <Button type="submit">
                  <Sparkles data-icon="inline-start" aria-hidden="true" />
                  {t.analysis.run}
                </Button>
              )}
            </form>
          </CardContent>
        </Card>

        <Card className="min-h-80">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <Sparkles className="size-4 text-primary" aria-hidden="true" />
              Gemini
            </CardTitle>
            {usedRange && (
              <CardDescription>
                {fill(t.analysis.basedOn, { city: usedRange.city, from: usedRange.from, to: usedRange.to })}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent className="flex flex-col gap-4" aria-live="polite">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{t.analysis.error}</AlertDescription>
              </Alert>
            )}
            {!completion && !isLoading && !error && (
              <p className="text-pretty leading-relaxed text-muted-foreground">{t.analysis.empty}</p>
            )}
            {isLoading && !completion && (
              <p className="animate-pulse text-sm text-muted-foreground">{t.analysis.running}</p>
            )}
            {completion && (
              <div className="prose-sm max-w-none text-sm leading-relaxed [&_h2]:mt-4 [&_h2]:font-serif [&_h2]:text-lg [&_h2]:font-semibold [&_li]:my-1 [&_p]:my-2 [&_ul]:list-disc [&_ul]:pl-5">
                <Streamdown isAnimating={isLoading}>{completion}</Streamdown>
              </div>
            )}
            {completion && !isLoading && <p className="text-xs text-muted-foreground">{t.analysis.disclaimer}</p>}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
