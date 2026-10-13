"use client"

import "leaflet/dist/leaflet.css"
import type * as Leaflet from "leaflet"
import { Pause, Play } from "lucide-react"
import { useEffect, useEffectEvent, useRef, useState } from "react"
import useSWR from "swr"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { CITIES, aqiBand, latestValue, type City, type Lang } from "@/lib/eco-data"
import { EMISSION_HEX, emissionLevel, escapeHtml, useFacilities } from "@/lib/facilities"
import { OVERLAY_LAYERS, WindOverlay, fetchGrid, overlayScale, type OverlayLayer } from "@/lib/wind-overlay"
import { useCitySeries, useEco } from "./eco-provider"
import { SectionHeading } from "./section-heading"

const AQI_HEX = ["#4f9d69", "#a9c75a", "#e9c74a", "#e48b3a", "#c8442e", "#7b2d5a"]

async function fetchBoundary() {
  const r = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent("Павлодарская область")}&format=json&polygon_geojson=1&limit=1&featuretype=state`,
  )
  if (!r.ok) throw new Error("boundary")
  const j = (await r.json()) as { geojson?: GeoJSON.GeoJsonObject }[]
  return j[0]?.geojson ?? null
}

function localeOf(lang: Lang) {
  return lang === "kk" ? "kk-KZ" : lang === "ru" ? "ru-RU" : "en-GB"
}

function timeLabel(iso: string, lang: Lang) {
  const [d, h] = iso.split("T")
  const [y, m, dd] = d.split("-").map(Number)
  const day = new Date(Date.UTC(y, m - 1, dd)).toLocaleDateString(localeOf(lang), {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  })
  return `${day}, ${h}`
}

export function WeatherMap() {
  const { t, lang } = useEco()
  const containerRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<Leaflet.Map | null>(null)
  const LRef = useRef<typeof Leaflet | null>(null)
  const overlayRef = useRef<WindOverlay | null>(null)

  const [layer, setLayer] = useState<OverlayLayer>("wind_speed_10m")
  const [particles, setParticles] = useState(true)
  const [adaptive, setAdaptive] = useState(true)
  const [ti, setTi] = useState<number | null>(null)
  const [playing, setPlaying] = useState(false)

  const grid = useSWR("wx-grid", fetchGrid, { revalidateOnFocus: false, refreshInterval: 30 * 60 * 1000 })
  const boundary = useSWR("region-boundary", fetchBoundary, { revalidateOnFocus: false, shouldRetryOnError: false })
  const g = grid.data
  const timeIndex = ti ?? g?.nowIndex ?? 0

  useEffect(() => {
    let cancelled = false
    let instance: Leaflet.Map | null = null
    import("leaflet").then((L) => {
      if (cancelled || !containerRef.current) return
      LRef.current = L
      instance = L.map(containerRef.current, { zoomControl: false, scrollWheelZoom: false }).setView([52.0, 76.2], 7)
      L.control.zoom({ position: "bottomleft" }).addTo(instance)
      L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
        attribution: "© OpenStreetMap contributors",
      }).addTo(instance)
      overlayRef.current = new WindOverlay(L, instance)
      setMap(instance)
    })
    return () => {
      cancelled = true
      overlayRef.current?.destroy()
      overlayRef.current = null
      instance?.remove()
    }
  }, [])

  useEffect(() => {
    if (!map || !boundary.data || !LRef.current) return
    const geo = LRef.current
      .geoJSON(boundary.data, { style: { color: "#2f6b4f", weight: 2, dashArray: "4 4", fill: false } })
      .addTo(map)
    return () => {
      geo.remove()
    }
  }, [map, boundary.data])

  useEffect(() => {
    if (map) overlayRef.current?.setData(g ?? null)
  }, [map, g])

  useEffect(() => {
    overlayRef.current?.setLayer(layer)
  }, [layer, map])

  useEffect(() => {
    overlayRef.current?.setParticles(particles)
  }, [particles, map])

  useEffect(() => {
    overlayRef.current?.setAdaptive(adaptive)
  }, [adaptive, map])

  useEffect(() => {
    overlayRef.current?.setTime(timeIndex)
  }, [timeIndex, map])

  useEffect(() => {
    if (!playing || !g) return
    const id = window.setInterval(() => {
      setTi((cur) => {
        const next = (cur ?? g.nowIndex) + 1
        if (next >= g.time.length) {
          setPlaying(false)
          return cur
        }
        return next
      })
    }, 900)
    return () => window.clearInterval(id)
  }, [playing, g])

  useEffect(() => {
    if (!containerRef.current) return
    const io = new IntersectionObserver(([e]) => overlayRef.current?.setVisible(e.isIntersecting))
    io.observe(containerRef.current)
    return () => io.disconnect()
  }, [])

  const onMapClick = useEffectEvent((e: Leaflet.LeafletMouseEvent) => {
    const target = e.originalEvent?.target as HTMLElement | null
    if (target?.closest?.(".leaflet-interactive,.leaflet-popup,.leaflet-control")) return
    if (!map || !g || layer === "off" || !LRef.current) return
    const v = overlayRef.current?.sample(layer, e.latlng.lat, e.latlng.lng)
    const unit = g.units[layer] ?? ""
    LRef.current
      .popup()
      .setLatLng(e.latlng)
      .setContent(
        `<strong>${escapeHtml(t.params[layer])}</strong><br>${
          v == null ? t.map.noData : `<span style="font-size:18px;font-weight:600">${v.toFixed(1)}</span> ${escapeHtml(unit)}`
        }<br><span style="opacity:.7">${escapeHtml(timeLabel(g.time[timeIndex], lang))} · Open-Meteo</span><br><small style="opacity:.6">${escapeHtml(t.map.clickHint)}</small>`,
      )
      .openOn(map)
  })

  useEffect(() => {
    if (!map) return
    const handler = (e: Leaflet.LeafletMouseEvent) => onMapClick(e)
    map.on("click", handler)
    return () => {
      map.off("click", handler)
    }
  }, [map])

  const scale = layer !== "off" ? overlayScale(g, layer, timeIndex, adaptive) : null
  const span = scale ? scale.range[1] - scale.range[0] : 0
  const fmtScale = (v: number) => (span < 10 ? v.toFixed(1) : String(Math.round(v)))
  const whoPct =
    scale?.who != null ? ((scale.who - scale.range[0]) / Math.max(span, 1e-6)) * 100 : null
  const airMissing = Boolean(g && !g.airAvailable && scale?.who != null)
  const nowPct = g ? (g.nowIndex / Math.max(1, g.time.length - 1)) * 100 : 0
  const isForecast = g ? timeIndex > g.nowIndex : false

  return (
    <section id="map" className="bg-secondary/50 py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading title={t.map.title} subtitle={t.map.subtitle} />

        <Card className="overflow-hidden p-0">
          <div className="flex flex-col gap-3 border-b p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <label htmlFor="wx-layer" className="text-sm font-medium">
                {t.map.layer}
              </label>
              <Select value={layer} onValueChange={(v) => v && setLayer(v as OverlayLayer)}>
                <SelectTrigger id="wx-layer" className="min-w-48">
                  <SelectValue>{(v: OverlayLayer) => (v === "off" ? t.map.off : t.params[v])}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="off">{t.map.off}</SelectItem>
                    {OVERLAY_LAYERS.map((p) => (
                      <SelectItem key={p} value={p}>
                        {t.params[p]}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <label className="flex items-center gap-2 text-sm" title={t.map.adaptiveHint}>
                <Switch checked={adaptive} onCheckedChange={setAdaptive} />
                {t.map.adaptive}
              </label>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={particles} onCheckedChange={setParticles} />
                {t.map.particles}
              </label>
            </div>
          </div>

          <div className="relative">
            <div ref={containerRef} className="h-[60vh] min-h-[380px] w-full" role="region" aria-label={t.map.title} />

            {scale && layer !== "off" && (
              <div className="pointer-events-none absolute right-3 top-3 z-[500] w-36 rounded-xl border bg-card/90 p-3 text-xs shadow-sm backdrop-blur">
                <p className="font-semibold leading-tight">{t.params[layer]}</p>
                <p className="text-muted-foreground">{g?.units[layer]}</p>
                <div
                  className="relative mt-2 h-2 rounded-full"
                  style={{ background: `linear-gradient(to right, ${scale.colors.join(",")})` }}
                >
                  {whoPct != null && whoPct >= 0 && whoPct <= 100 && (
                    <span className="absolute -top-1 h-4 w-0.5 bg-foreground" style={{ left: `${whoPct}%` }} />
                  )}
                </div>
                <div className="mt-1 flex justify-between tabular-nums text-muted-foreground">
                  <span>{fmtScale(scale.range[0])}</span>
                  <span>
                    {fmtScale(scale.range[1])}
                    {scale.adaptive ? "" : "+"}
                  </span>
                </div>
                {scale.who != null && (
                  <p className="mt-1 text-muted-foreground">
                    {t.map.who}: {scale.who}
                    {whoPct != null && whoPct > 100 ? " ↑" : ""}
                  </p>
                )}
                {scale.adaptive && <p className="mt-1 text-[10px] leading-tight text-muted-foreground">{t.map.adaptiveNote}</p>}
              </div>
            )}

            <div className="pointer-events-none absolute bottom-3 right-3 z-[500] flex flex-col gap-1 rounded-xl border bg-card/90 p-3 text-xs shadow-sm backdrop-blur">
              <span className="flex items-center gap-2">
                <span className="size-3 rounded-full border-2 border-card bg-[var(--aqi-1)] shadow" />
                {t.map.cityLayer}
              </span>
              <span className="flex items-center gap-2">
                <span className="size-3 rotate-45 border-2 border-card shadow" style={{ background: EMISSION_HEX[3] }} />
                {t.map.facilityLayer}
              </span>
              <span className="flex items-center gap-1 pl-5 text-[10px] text-muted-foreground">
                {[1, 2, 3].map((l) => (
                  <span key={l} className="size-2 rotate-45" style={{ background: EMISSION_HEX[l] }} />
                ))}
                {t.map.emissionScale}
              </span>
            </div>

            {(grid.isLoading || grid.error || airMissing) && (
              <div className="absolute inset-x-3 top-3 z-[500] max-w-sm">
                <Alert variant={grid.error || airMissing ? "destructive" : "default"} className="bg-card/95">
                  <AlertDescription>{grid.isLoading ? t.map.loading : t.map.error}</AlertDescription>
                </Alert>
              </div>
            )}
          </div>

          <CardContent className="flex flex-col gap-3 border-t py-4">
            <div className="flex items-center gap-3">
              <Button
                size="icon"
                variant="outline"
                className="rounded-full"
                disabled={!g}
                aria-label={playing ? t.map.pause : t.map.play}
                onClick={() => {
                  if (!g) return
                  if (!playing && timeIndex >= g.time.length - 1) setTi(g.nowIndex)
                  setPlaying((p) => !p)
                }}
              >
                {playing ? <Pause /> : <Play />}
              </Button>
              <div className="flex flex-1 flex-col gap-0.5">
                <span className="text-sm font-semibold tabular-nums">{g ? timeLabel(g.time[timeIndex], lang) : "—"}</span>
                <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: isForecast ? "var(--chart-2)" : "var(--primary)" }}
                  />
                  {isForecast ? t.map.forecast : g && timeIndex === g.nowIndex ? t.map.now : t.map.observed} ·
                  Asia/Almaty
                </span>
              </div>
              {g && timeIndex !== g.nowIndex && (
                <Button variant="ghost" size="sm" onClick={() => setTi(g.nowIndex)}>
                  {t.map.now}
                </Button>
              )}
            </div>
            <div className="flex flex-col gap-1.5">
              <div
                className="h-1 rounded-full"
                style={{
                  background: `linear-gradient(to right, var(--primary) ${nowPct}%, var(--chart-2) ${nowPct}%)`,
                }}
                aria-hidden="true"
              />
              <Slider
                min={0}
                max={g ? g.time.length - 1 : 1}
                step={1}
                value={timeIndex}
                disabled={!g}
                onValueChange={(v) => {
                  setPlaying(false)
                  setTi(Array.isArray(v) ? v[0] : v)
                }}
                aria-label={t.map.forecast}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{t.map.observed}</span>
                <span>{t.map.forecast}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {map && LRef.current && (
          <>
            {CITIES.map((c) => (
              <CityMarker key={c.id} city={c} map={map} L={LRef.current!} />
            ))}
            <FacilityMarkers map={map} L={LRef.current} />
          </>
        )}
      </div>
    </section>
  )
}

function CityMarker({ city: c, map, L }: { city: City; map: Leaflet.Map; L: typeof Leaflet }) {
  const { t, lang, city, setCityId } = useEco()
  const { data } = useCitySeries(c)
  const selected = city.id === c.id

  useEffect(() => {
    const aqi = data ? latestValue(data, "european_aqi") : null
    const pm = data ? latestValue(data, "pm2_5") : null
    const temp = data ? latestValue(data, "temperature_2m") : null
    const band = aqiBand(aqi?.value)
    const marker = L.circleMarker([c.lat, c.lon], {
      radius: selected ? 14 : 10,
      color: "#fff",
      weight: selected ? 3 : 2,
      fillColor: band ? AQI_HEX[band.level - 1] : "#8a9a90",
      fillOpacity: 0.95,
    })
      .addTo(map)
      .bindTooltip(c.name[lang], { direction: "top", offset: [0, -10] })
      .bindPopup(
        `<strong style="font-size:15px">${escapeHtml(c.name[lang])}</strong><br>` +
          `AQI: <strong>${aqi ? Math.round(aqi.value) : "—"}</strong> ${band ? `(${escapeHtml(t.bands[band.key].label)})` : ""}<br>` +
          `PM2.5: ${pm ? pm.value.toFixed(1) : "—"} ${escapeHtml(data?.units.pm2_5 ?? "")}<br>` +
          `${escapeHtml(t.params.temperature_2m)}: ${temp ? temp.value.toFixed(1) : "—"} ${escapeHtml(data?.units.temperature_2m ?? "")}<br>` +
          `<small style="opacity:.6">${aqi ? escapeHtml(aqi.time.replace("T", " ")) : ""} · Open-Meteo</small>`,
      )
      .on("click", () => setCityId(c.id))
    return () => {
      marker.remove()
    }
  }, [data, lang, t, selected, map, L, c, setCityId])

  return null
}

function FacilityMarkers({ map, L }: { map: Leaflet.Map; L: typeof Leaflet }) {
  const { t } = useEco()
  const items = useFacilities()

  useEffect(() => {
    const group = L.layerGroup().addTo(map)
    for (const o of items) {
      const level = emissionLevel(o.emissions)
      const size = 12 + level * 3
      L.marker([o.lat, o.lon], {
        icon: L.divIcon({
          className: "",
          html: `<span style="display:block;width:${size}px;height:${size}px;transform:rotate(45deg);border:2px solid #fff;box-shadow:0 1px 3px rgba(0,0,0,.4);background:${EMISSION_HEX[level]}"></span>`,
          iconSize: [size, size],
          iconAnchor: [size / 2, size / 2],
        }),
        zIndexOffset: 100 + level * 10,
      })
        .addTo(group)
        .bindTooltip(o.name, { direction: "top", offset: [0, -size / 2] })
        .bindPopup(
          `<strong>${escapeHtml(o.name)}</strong>${o.type ? `<br><span style="opacity:.75">${escapeHtml(o.type)}</span>` : ""}<br>` +
            `${escapeHtml(o.description ?? "")}` +
            `${o.emissions ? `<br>${escapeHtml(t.facilities.emissionsLabel)}: <strong style="color:${EMISSION_HEX[level]}">${escapeHtml(o.emissions)}</strong>` : ""}` +
            `${o.status ? `<br>${escapeHtml(o.status)}${o.origin ? ` · ${escapeHtml(o.origin)}` : ""}` : ""}` +
            `${o.comment ? `<br><small style="opacity:.75">${escapeHtml(o.comment)}</small>` : ""}` +
            `${o.url && /^https?:\/\//.test(o.url) ? `<br><a href="${escapeHtml(o.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(o.source || "link")}</a>` : o.source ? `<br>${escapeHtml(o.source)}` : ""}`,
        )
    }
    return () => {
      group.remove()
    }
  }, [items, map, L, t])

  return null
}
