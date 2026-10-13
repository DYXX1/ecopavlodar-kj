"use client"

import { CalendarRange } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { DATA_MIN_DATE, DEFAULT_START, daysBetween, shiftDate, todayAlmaty, type DateRange } from "@/lib/eco-data"
import { fill } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import { useCityHistory, useEco } from "./eco-provider"

export function DateRangeControl({ className }: { className?: string }) {
  const { t, range, setRange, city } = useEco()
  const { isValidating } = useCityHistory(city)
  const [draft, setDraft] = useState<DateRange>(range)
  const today = todayAlmaty()

  useEffect(() => setDraft(range), [range])

  const valid = draft.start >= DATA_MIN_DATE && draft.end <= today && draft.start <= draft.end
  const dirty = draft.start !== range.start || draft.end !== range.end

  const presets: { label: string; value: DateRange }[] = [
    { label: t.range.since2025, value: { start: DEFAULT_START, end: today } },
    { label: t.range.thisYear, value: { start: `${today.slice(0, 4)}-01-01`, end: today } },
    { label: t.range.last90, value: { start: shiftDate(today, -89), end: today } },
    { label: t.range.last30, value: { start: shiftDate(today, -29), end: today } },
  ]

  const inputClass =
    "h-9 rounded-md border bg-background px-3 text-sm tabular-nums shadow-xs outline-none focus-visible:ring-2 focus-visible:ring-ring [color-scheme:light] dark:[color-scheme:dark]"

  return (
    <div className={cn("flex flex-col gap-3 rounded-2xl border bg-card p-4 md:flex-row md:items-end md:justify-between", className)}>
      <form
        className="flex flex-wrap items-end gap-3"
        onSubmit={(e) => {
          e.preventDefault()
          if (valid) setRange(draft)
        }}
      >
        <div className="flex items-center gap-2 self-center text-sm font-medium">
          <CalendarRange className="size-4 text-primary" aria-hidden="true" />
          {t.range.title}
        </div>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          {t.range.from}
          <input
            type="date"
            className={inputClass}
            min={DATA_MIN_DATE}
            max={draft.end}
            value={draft.start}
            onChange={(e) => setDraft((d) => ({ ...d, start: e.target.value }))}
          />
        </label>
        <label className="flex flex-col gap-1 text-xs text-muted-foreground">
          {t.range.to}
          <input
            type="date"
            className={inputClass}
            min={draft.start}
            max={today}
            value={draft.end}
            onChange={(e) => setDraft((d) => ({ ...d, end: e.target.value }))}
          />
        </label>
        <Button type="submit" size="sm" disabled={!valid || !dirty}>
          {t.range.apply}
        </Button>
      </form>
      <div className="flex flex-col gap-2 md:items-end">
        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <Button
              key={p.label}
              type="button"
              size="sm"
              variant={p.value.start === range.start && p.value.end === range.end ? "secondary" : "ghost"}
              onClick={() => setRange(p.value)}
            >
              {p.label}
            </Button>
          ))}
        </div>
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {isValidating ? t.range.loading : fill(t.range.summary, { n: daysBetween(range.start, range.end) + 1 })}
        </p>
      </div>
    </div>
  )
}
