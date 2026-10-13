"use client"

import Image from "next/image"
import { ArrowDown, HeartPulse } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { AQI_COLOR_VAR, CITIES, aqiBand, latestValue } from "@/lib/eco-data"
import { useCitySeries, useEco } from "./eco-provider"

export function Hero() {
  const { t, lang, city, setCityId } = useEco()

  return (
    <section id="top" className="mx-auto max-w-6xl px-4 pt-6 md:px-6">
      <div className="relative overflow-hidden rounded-3xl">
        <Image
          src="/images/hero-irtysh.png"
          alt=""
          fill
          priority
          sizes="(min-width: 1152px) 1152px, 100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/85 via-foreground/60 to-foreground/20" />
        <div className="relative grid gap-8 px-6 py-10 md:grid-cols-[1.3fr_1fr] md:items-end md:px-10 md:py-14">
          <div className="flex flex-col gap-5 text-primary-foreground">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">
              {t.hero.eyebrow}
            </p>
            <h1 className="text-balance font-serif text-4xl font-semibold leading-tight md:text-5xl">{t.hero.title}</h1>
            <p className="max-w-lg text-pretty leading-relaxed text-primary-foreground/85">{t.hero.subtitle}</p>
            <div className="flex flex-col gap-2">
              <span className="text-sm text-primary-foreground/75">{t.hero.chooseCity}</span>
              <ToggleGroup
                aria-label={t.hero.chooseCity}
                value={[city.id]}
                onValueChange={(v) => v[0] && setCityId(v[0])}
                spacing={2}
                className="flex-wrap"
              >
                {CITIES.map((c) => (
                  <ToggleGroupItem
                    key={c.id}
                    value={c.id}
                    className="rounded-full bg-background/15 px-4 text-primary-foreground backdrop-blur hover:bg-background/25 hover:text-primary-foreground aria-pressed:bg-background aria-pressed:text-foreground"
                  >
                    {c.name[lang]}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
            <Button
              render={<a href="#map" />}
              nativeButton={false}
              variant="secondary"
              className="w-fit rounded-full"
            >
              {t.hero.explore}
              <ArrowDown data-icon="inline-end" />
            </Button>
          </div>
          <AqiNowCard />
        </div>
      </div>
    </section>
  )
}

function AqiNowCard() {
  const { t, lang, city } = useEco()
  const { data, error, isLoading } = useCitySeries(city)
  const aqi = data ? latestValue(data, "european_aqi") : null
  const band = aqiBand(aqi?.value)

  return (
    <div className="rounded-2xl bg-card/95 p-6 text-card-foreground shadow-xl backdrop-blur" aria-live="polite">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{t.aqi.title}</p>
          <p className="font-serif text-lg font-semibold">{city.name[lang]}</p>
        </div>
        <span className="text-xs text-muted-foreground">{t.aqi.scale}</span>
      </div>

      {isLoading ? (
        <div className="mt-5 flex flex-col gap-3">
          <Skeleton className="h-14 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      ) : error || !aqi || !band ? (
        <p className="mt-5 text-sm text-muted-foreground">{error ? t.fetchError : t.aqi.unavailable}</p>
      ) : (
        <>
          <div className="mt-4 flex items-end gap-3">
            <span className="font-serif text-6xl font-semibold leading-none tabular-nums">{Math.round(aqi.value)}</span>
            <span
              className="mb-1 rounded-full px-3 py-1 text-sm font-semibold text-foreground"
              style={{ backgroundColor: AQI_COLOR_VAR[band.level] }}
            >
              {t.bands[band.key].label}
            </span>
          </div>
          <AqiScale value={aqi.value} />
          <div className="mt-5 flex gap-3 rounded-xl bg-secondary p-3 text-secondary-foreground">
            <HeartPulse className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <p className="text-sm leading-relaxed">
              <span className="sr-only">{t.aqi.advice}: </span>
              {t.bands[band.key].advice}
            </p>
          </div>
          <p className="mt-3 text-xs text-muted-foreground">
            {t.aqi.updated} {aqi.time.replace("T", " ")} · Open-Meteo / CAMS
          </p>
        </>
      )}
    </div>
  )
}

export function AqiScale({ value }: { value: number }) {
  const pos = Math.min(100, Math.max(0, (value / 120) * 100))
  return (
    <div className="mt-4" aria-hidden="true">
      <div className="relative h-2 rounded-full bg-[linear-gradient(to_right,var(--aqi-1),var(--aqi-2),var(--aqi-3),var(--aqi-4),var(--aqi-5),var(--aqi-6))]">
        <span
          className="absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-card bg-foreground shadow"
          style={{ left: `${pos}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between text-[10px] text-muted-foreground tabular-nums">
        <span>0</span>
        <span>40</span>
        <span>80</span>
        <span>120</span>
      </div>
    </div>
  )
}
