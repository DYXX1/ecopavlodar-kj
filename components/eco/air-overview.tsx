"use client"

import { ArrowUp, Check, CloudRain, Droplets, Gauge, Thermometer, Wind } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  AQI_COLOR_VAR,
  CITIES,
  WHO_GUIDELINE,
  aqiBand,
  compassIndex,
  formatValue,
  latestValue,
  type City,
  type CitySeries,
  type Param,
} from "@/lib/eco-data"
import { cn } from "@/lib/utils"
import { useCitySeries, useEco } from "./eco-provider"
import { SectionHeading } from "./section-heading"

const POLLUTANTS: Param[] = ["pm2_5", "pm10", "nitrogen_dioxide", "sulphur_dioxide", "ozone", "carbon_monoxide"]

export function AirOverview() {
  const { t, city } = useEco()
  const { data, error, isLoading } = useCitySeries(city)

  return (
    <section id="overview" className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <SectionHeading title={t.overview.title} subtitle={t.overview.subtitle} />

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertDescription>{t.fetchError}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            {t.overview.pollutants}
          </h3>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {POLLUTANTS.map((p) =>
              isLoading ? <Skeleton key={p} className="h-32 rounded-xl" /> : <PollutantTile key={p} p={p} data={data} />,
            )}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">{t.overview.weather}</h3>
          {isLoading ? <Skeleton className="h-full min-h-64 rounded-xl" /> : <WeatherCard data={data} />}
        </div>
      </div>

      <CityCompare />
    </section>
  )
}

function PollutantTile({ p, data }: { p: Param; data?: CitySeries }) {
  const { t } = useEco()
  const latest = data ? latestValue(data, p) : null
  const guideline = WHO_GUIDELINE[p]
  const ratio = latest && guideline ? latest.value / guideline : null
  const tone = ratio == null ? "muted" : ratio <= 0.5 ? "good" : ratio <= 1 ? "fair" : ratio <= 2 ? "poor" : "bad"
  const barColor =
    tone === "good" ? "var(--aqi-1)" : tone === "fair" ? "var(--aqi-3)" : tone === "poor" ? "var(--aqi-4)" : "var(--aqi-5)"

  return (
    <Card size="sm" className="gap-3">
      <CardHeader>
        <CardDescription>{t.params[p]}</CardDescription>
        <CardTitle className="flex items-baseline gap-1.5">
          <span className="font-serif text-3xl font-semibold tabular-nums">{formatValue(latest?.value, p)}</span>
          <span className="text-xs font-normal text-muted-foreground">{data?.units[p]}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1.5">
        {guideline && ratio != null ? (
          <>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-muted"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={200}
              aria-valuenow={Math.round(ratio * 100)}
              aria-label={`${Math.round(ratio * 100)}% ${t.overview.ofGuideline}`}
            >
              <div
                className="h-full rounded-full transition-[width]"
                style={{ width: `${Math.min(100, ratio * 50)}%`, backgroundColor: barColor }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              <span className="font-semibold text-foreground tabular-nums">{Math.round(ratio * 100)}%</span>{" "}
              {t.overview.ofGuideline} ({guideline})
            </p>
          </>
        ) : (
          <p className="text-xs text-muted-foreground">{t.overview.noGuideline}</p>
        )}
      </CardContent>
    </Card>
  )
}

function WeatherCard({ data }: { data?: CitySeries }) {
  const { t } = useEco()
  const v = (p: Param) => (data ? latestValue(data, p)?.value : undefined)
  const dir = v("wind_direction_10m")
  const rows: { p: Param; icon: typeof Wind; extra?: React.ReactNode }[] = [
    { p: "temperature_2m", icon: Thermometer },
    { p: "relative_humidity_2m", icon: Droplets },
    {
      p: "wind_speed_10m",
      icon: Wind,
      extra:
        dir != null ? (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <ArrowUp className="size-3.5" style={{ transform: `rotate(${dir + 180}deg)` }} aria-hidden="true" />
            {t.dirs[compassIndex(dir)]}
          </span>
        ) : null,
    },
    { p: "pressure_msl", icon: Gauge },
    { p: "precipitation", icon: CloudRain },
  ]

  return (
    <Card className="h-full bg-secondary/60">
      <CardContent className="flex flex-col divide-y">
        {rows.map(({ p, icon: Icon, extra }) => (
          <div key={p} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-card text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <span className="flex-1 text-sm text-muted-foreground">{t.params[p]}</span>
            {extra}
            <span className="font-semibold tabular-nums">
              {formatValue(v(p), p)} <span className="text-xs font-normal text-muted-foreground">{data?.units[p]}</span>
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function CityCompare() {
  const { t } = useEco()
  return (
    <div className="mt-12">
      <div className="mb-4 flex flex-col gap-1">
        <h3 className="font-serif text-2xl font-semibold">{t.overview.compareTitle}</h3>
        <p className="text-sm text-muted-foreground">{t.overview.compareSubtitle}</p>
      </div>
      <div className="grid gap-3 md:grid-cols-3">
        {CITIES.map((c) => (
          <CityCard key={c.id} city={c} />
        ))}
      </div>
    </div>
  )
}

function CityCard({ city: c }: { city: City }) {
  const { t, lang, city, setCityId } = useEco()
  const { data, isLoading } = useCitySeries(c)
  const aqi = data ? latestValue(data, "european_aqi")?.value : undefined
  const band = aqiBand(aqi)
  const selected = city.id === c.id

  return (
    <button
      type="button"
      onClick={() => setCityId(c.id)}
      aria-pressed={selected}
      className={cn(
        "group flex flex-col gap-4 rounded-2xl border bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-none",
        selected && "border-primary ring-1 ring-primary",
      )}
    >
      <div className="flex items-center justify-between">
        <span className="font-serif text-lg font-semibold">{c.name[lang]}</span>
        {selected && (
          <span className="flex items-center gap-1 text-xs font-medium text-primary">
            <Check className="size-3.5" aria-hidden="true" />
            {t.overview.selected}
          </span>
        )}
      </div>
      {isLoading ? (
        <Skeleton className="h-12 w-full" />
      ) : (
        <div className="flex items-center gap-4">
          <span
            className="flex size-14 shrink-0 items-center justify-center rounded-full font-serif text-xl font-semibold text-foreground tabular-nums"
            style={{ backgroundColor: band ? AQI_COLOR_VAR[band.level] : "var(--muted)" }}
          >
            {aqi != null ? Math.round(aqi) : "—"}
          </span>
          <div className="flex flex-col gap-0.5 text-sm">
            <span className="font-medium">{band ? t.bands[band.key].label : "—"}</span>
            <span className="text-muted-foreground tabular-nums">
              PM2.5 {formatValue(data ? latestValue(data, "pm2_5")?.value : null, "pm2_5")} ·{" "}
              {formatValue(data ? latestValue(data, "temperature_2m")?.value : null, "temperature_2m")}
              {data?.units.temperature_2m}
            </span>
          </div>
        </div>
      )}
    </button>
  )
}
