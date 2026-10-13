"use client"

import { Info, Lightbulb, TrendingDown, TrendingUp, Wind } from "lucide-react"
import { useMemo, useState } from "react"
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import {
  AIR_PARAMS,
  CITIES,
  WEATHER_PARAMS,
  WHO_GUIDELINE,
  compassIndex,
  formatValue,
  periodStats,
  type City,
  type Param,
  type PeriodStats,
} from "@/lib/eco-data"
import { fill } from "@/lib/i18n"
import { useCitySeries, useEco } from "./eco-provider"
import { SectionHeading } from "./section-heading"

const PERIODS = [
  { key: "d1", hours: 24 },
  { key: "d7", hours: 24 * 7 },
  { key: "d30", hours: 24 * 30 },
  { key: "d90", hours: 24 * 90 },
] as const
type PeriodKey = (typeof PERIODS)[number]["key"]

export function Trends() {
  const { t, lang, city } = useEco()
  const [param, setParam] = useState<Param>("pm2_5")
  const [period, setPeriod] = useState<PeriodKey>("d7")
  const hours = PERIODS.find((p) => p.key === period)!.hours
  const { data, error, isLoading } = useCitySeries(city)
  const stats = useMemo(() => (data ? periodStats(data, param, hours) : null), [data, param, hours])
  const windStats = useMemo(() => (data ? periodStats(data, "wind_direction_10m", hours) : null), [data, hours])
  const unit = data?.units[param] ?? ""

  return (
    <section id="trends" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <SectionHeading title={t.trends.title} subtitle={t.trends.subtitle} />

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <label htmlFor="trend-param" className="text-sm font-medium">
            {t.trends.parameter}
          </label>
          <Select value={param} onValueChange={(v) => v && setParam(v as Param)}>
            <SelectTrigger id="trend-param" className="min-w-56">
              <SelectValue>{(v: Param) => t.params[v]}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>{t.trends.airGroup}</SelectLabel>
                {AIR_PARAMS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {t.params[p]}
                  </SelectItem>
                ))}
              </SelectGroup>
              <SelectGroup>
                <SelectLabel>{t.trends.weatherGroup}</SelectLabel>
                {WEATHER_PARAMS.filter((p) => p !== "wind_direction_10m").map((p) => (
                  <SelectItem key={p} value={p}>
                    {t.params[p]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <ToggleGroup
          aria-label="Period"
          value={[period]}
          onValueChange={(v) => v[0] && setPeriod(v[0] as PeriodKey)}
          variant="outline"
        >
          {PERIODS.map((p) => (
            <ToggleGroupItem key={p.key} value={p.key} className="px-3">
              {t.trends.periods[p.key]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{t.fetchError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle className="font-serif text-xl">
              {t.params[param]} · {city.name[lang]}
            </CardTitle>
            <CardDescription>
              {stats?.daily ? t.trends.dailyMeans : t.trends.hourly}, {unit}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-6">
            {isLoading ? (
              <Skeleton className="h-72 w-full" />
            ) : stats ? (
              <TrendChart stats={stats} param={param} unit={unit} />
            ) : (
              <p className="py-20 text-center text-sm text-muted-foreground">{t.trends.noData}</p>
            )}
            <StatTiles stats={stats} param={param} unit={unit} />
          </CardContent>
        </Card>

        <Card className="bg-primary text-primary-foreground">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 font-serif text-xl">
              <Lightbulb className="size-5" aria-hidden="true" />
              {t.trends.insightsTitle}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-40 w-full bg-primary-foreground/20" />
            ) : (
              <Insights stats={stats} windDir={windStats?.mean ?? null} param={param} unit={unit} />
            )}
          </CardContent>
        </Card>
      </div>

      <CompareTable param={param} hours={hours} />
    </section>
  )
}

function TrendChart({ stats, param, unit }: { stats: PeriodStats; param: Param; unit: string }) {
  const { t, lang } = useEco()
  const locale = lang === "kk" ? "kk-KZ" : lang === "ru" ? "ru-RU" : "en-GB"
  const guideline = WHO_GUIDELINE[param]
  const config = { v: { label: `${t.params[param]}, ${unit}`, color: "var(--chart-1)" } } satisfies ChartConfig
  const fmt = (s: string) => {
    const [d, h] = s.split("T")
    const [y, m, dd] = d.split("-").map(Number)
    const dt = new Date(Date.UTC(y, m - 1, dd))
    const day = dt.toLocaleDateString(locale, { day: "numeric", month: "short", timeZone: "UTC" })
    return h && !stats.daily ? `${day} ${h}` : day
  }

  return (
    <ChartContainer config={config} className="aspect-auto h-72 w-full">
      <AreaChart data={stats.points} margin={{ left: 0, right: 8, top: 8 }}>
        <defs>
          <linearGradient id="trend-fill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-v)" stopOpacity={0.35} />
            <stop offset="100%" stopColor="var(--color-v)" stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid vertical={false} strokeDasharray="3 3" />
        <XAxis dataKey="t" tickLine={false} axisLine={false} minTickGap={40} tickFormatter={fmt} />
        <YAxis tickLine={false} axisLine={false} width={40} />
        <ChartTooltip content={<ChartTooltipContent labelFormatter={(l) => fmt(String(l))} />} />
        {guideline != null && (
          <ReferenceLine
            y={guideline}
            stroke="var(--destructive)"
            strokeDasharray="5 4"
            label={{ value: `${t.map.who} ${guideline}`, position: "insideTopRight", fill: "var(--destructive)", fontSize: 11 }}
          />
        )}
        <Area
          dataKey="v"
          type="monotone"
          stroke="var(--color-v)"
          strokeWidth={2}
          fill="url(#trend-fill)"
          connectNulls={false}
          dot={false}
          isAnimationActive={false}
        />
      </AreaChart>
    </ChartContainer>
  )
}

function StatTiles({ stats, param, unit }: { stats: PeriodStats | null; param: Param; unit: string }) {
  const { t } = useEco()
  const change = stats?.change
  const tiles = [
    { label: t.trends.mean, value: formatValue(stats?.mean, param), suffix: unit },
    { label: t.trends.min, value: formatValue(stats?.min, param), suffix: unit },
    { label: t.trends.max, value: formatValue(stats?.max, param), suffix: unit },
    stats?.daysAboveGuideline != null
      ? {
          label: t.trends.daysAbove,
          value: String(stats.daysAboveGuideline),
          suffix: fill(t.trends.ofDays, { n: stats.totalDays }),
        }
      : {
          label: `${t.trends.change}, ${t.trends.vsPrevious}`,
          value: change == null ? "—" : `${change > 0 ? "+" : ""}${formatValue(change, param)}`,
          suffix: unit,
        },
  ]
  return (
    <dl className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {tiles.map((tile) => (
        <div key={tile.label} className="flex flex-col gap-1 rounded-xl bg-secondary/70 p-3">
          <dt className="text-xs text-muted-foreground">{tile.label}</dt>
          <dd className="flex items-baseline gap-1">
            <span className="font-serif text-2xl font-semibold tabular-nums">{tile.value}</span>
            <span className="text-xs text-muted-foreground">{tile.suffix}</span>
          </dd>
        </div>
      ))}
    </dl>
  )
}

function Insights({
  stats,
  windDir,
  param,
  unit,
}: {
  stats: PeriodStats | null
  windDir: number | null
  param: Param
  unit: string
}) {
  const { t } = useEco()
  if (!stats) return <p className="text-sm text-primary-foreground/80">{t.trends.noData}</p>

  const items: { icon: typeof Wind; text: string }[] = []
  if (windDir != null) {
    items.push({
      icon: Wind,
      text: fill(t.trends.insightWind, { n: t.dirs[compassIndex(windDir)], d: Math.round(windDir) }),
    })
  }
  if (stats.change != null) {
    const threshold = Math.max(Math.abs(stats.mean ?? 0) * 0.05, 0.1)
    const abs = formatValue(Math.abs(stats.change), param)
    items.push(
      Math.abs(stats.change) < threshold
        ? { icon: Info, text: t.trends.insightTrendFlat }
        : stats.change > 0
          ? { icon: TrendingUp, text: fill(t.trends.insightTrendUp, { v: abs, u: unit }) }
          : { icon: TrendingDown, text: fill(t.trends.insightTrendDown, { v: abs, u: unit }) },
    )
  }
  if (stats.daysAboveGuideline != null) {
    items.push({
      icon: Info,
      text:
        stats.daysAboveGuideline === 0
          ? t.trends.insightGuidelineOk
          : fill(t.trends.insightGuidelineBad, { n: stats.daysAboveGuideline, t: stats.totalDays }),
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-4">
        {items.map(({ icon: Icon, text }) => (
          <li key={text} className="flex gap-3">
            <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary-foreground/15">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <p className="text-sm leading-relaxed">{text}</p>
          </li>
        ))}
      </ul>
      <p className="border-t border-primary-foreground/20 pt-4 text-xs leading-relaxed text-primary-foreground/75">
        {t.trends.insightCaveat}
        {stats.missingPct > 0 && ` ${t.trends.missing}: ${stats.missingPct.toFixed(0)}%.`}
      </p>
    </div>
  )
}

function CompareTable({ param, hours }: { param: Param; hours: number }) {
  const { t } = useEco()
  const showDays = WHO_GUIDELINE[param] != null
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle className="font-serif text-xl">{t.trends.compareTitle}</CardTitle>
        <CardDescription>{t.params[param]}</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.trends.city}</TableHead>
              <TableHead className="text-right">{t.trends.mean}</TableHead>
              <TableHead className="text-right">{t.trends.min}</TableHead>
              <TableHead className="text-right">{t.trends.max}</TableHead>
              <TableHead className="text-right">{showDays ? t.trends.daysAbove : t.trends.change}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {CITIES.map((c) => (
              <CompareRow key={c.id} city={c} param={param} hours={hours} showDays={showDays} />
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

function CompareRow({ city: c, param, hours, showDays }: { city: City; param: Param; hours: number; showDays: boolean }) {
  const { lang, city } = useEco()
  const { data, isLoading } = useCitySeries(c)
  const s = useMemo(() => (data ? periodStats(data, param, hours) : null), [data, param, hours])
  const unit = data?.units[param] ?? ""
  if (isLoading) {
    return (
      <TableRow>
        <TableCell colSpan={5}>
          <Skeleton className="h-5 w-full" />
        </TableCell>
      </TableRow>
    )
  }
  return (
    <TableRow data-state={city.id === c.id ? "selected" : undefined}>
      <TableCell className="font-medium">{c.name[lang]}</TableCell>
      <TableCell className="text-right tabular-nums">
        {formatValue(s?.mean, param)} <span className="text-muted-foreground">{unit}</span>
      </TableCell>
      <TableCell className="text-right tabular-nums">{formatValue(s?.min, param)}</TableCell>
      <TableCell className="text-right tabular-nums">{formatValue(s?.max, param)}</TableCell>
      <TableCell className="text-right tabular-nums">
        {showDays
          ? s?.daysAboveGuideline != null
            ? `${s.daysAboveGuideline} / ${s.totalDays}`
            : "—"
          : s?.change != null
            ? `${s.change > 0 ? "+" : ""}${formatValue(s.change, param)}`
            : "—"}
      </TableCell>
    </TableRow>
  )
}
