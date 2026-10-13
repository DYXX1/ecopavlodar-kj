export type Lang = "ru" | "kk" | "en"

export type City = { id: string; name: Record<Lang, string>; lat: number; lon: number }

export const CITIES: City[] = [
  { id: "pav", name: { ru: "Павлодар", kk: "Павлодар", en: "Pavlodar" }, lat: 52.287, lon: 76.967 },
  { id: "eki", name: { ru: "Экибастуз", kk: "Екібастұз", en: "Ekibastuz" }, lat: 51.723, lon: 75.323 },
  { id: "aks", name: { ru: "Аксу", kk: "Ақсу", en: "Aksu" }, lat: 52.044, lon: 76.924 },
]

export const WEATHER_PARAMS = [
  "temperature_2m",
  "relative_humidity_2m",
  "pressure_msl",
  "precipitation",
  "wind_speed_10m",
  "wind_gusts_10m",
  "wind_direction_10m",
] as const

export const AIR_PARAMS = [
  "european_aqi",
  "pm2_5",
  "pm10",
  "nitrogen_dioxide",
  "sulphur_dioxide",
  "ozone",
  "carbon_monoxide",
] as const

export type Param = (typeof WEATHER_PARAMS)[number] | (typeof AIR_PARAMS)[number]

export const isAirParam = (p: Param) => (AIR_PARAMS as readonly string[]).includes(p)

/** WHO 2021 air quality guidelines (24-hour; ozone is the 8-hour peak). Units: µg/m³ */
export const WHO_GUIDELINE: Partial<Record<Param, number>> = {
  pm2_5: 15,
  pm10: 45,
  nitrogen_dioxide: 25,
  sulphur_dioxide: 40,
  ozone: 100,
  carbon_monoxide: 4000,
}

export const DECIMALS: Partial<Record<Param, number>> = {
  pressure_msl: 0,
  relative_humidity_2m: 0,
  wind_direction_10m: 0,
  european_aqi: 0,
  carbon_monoxide: 0,
  precipitation: 1,
}

export type AqiBand = { level: 1 | 2 | 3 | 4 | 5 | 6; key: "good" | "fair" | "moderate" | "poor" | "vpoor" | "epoor" }

const BANDS: AqiBand[] = [
  { level: 1, key: "good" },
  { level: 2, key: "fair" },
  { level: 3, key: "moderate" },
  { level: 4, key: "poor" },
  { level: 5, key: "vpoor" },
  { level: 6, key: "epoor" },
]

/** European AQI bands: 0–20, 20–40, 40–60, 60–80, 80–100, >100 */
export function aqiBand(aqi: number | null | undefined): AqiBand | null {
  if (aqi == null) return null
  const i = Math.min(5, Math.floor(Math.max(0, aqi - 0.0001) / 20))
  return BANDS[i]
}

export const AQI_COLOR_VAR: Record<AqiBand["level"], string> = {
  1: "var(--aqi-1)",
  2: "var(--aqi-2)",
  3: "var(--aqi-3)",
  4: "var(--aqi-4)",
  5: "var(--aqi-5)",
  6: "var(--aqi-6)",
}

export type CitySeries = {
  time: string[]
  values: Partial<Record<Param, (number | null)[]>>
  units: Partial<Record<Param, string>>
  fetchedAt: number
  airAvailable: boolean
}

type OpenMeteoHourly = {
  hourly: Record<string, (number | null)[]> & { time: string[] }
  hourly_units: Record<string, string>
}

async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open-Meteo ${res.status}`)
  return res.json() as Promise<T>
}

export const PAST_DAYS = 92

export async function fetchCitySeries(lat: number, lon: number): Promise<CitySeries> {
  const base = `latitude=${lat}&longitude=${lon}&timezone=Asia%2FAlmaty&past_days=${PAST_DAYS}&forecast_days=2`
  const [weather, air] = await Promise.all([
    getJSON<OpenMeteoHourly>(`https://api.open-meteo.com/v1/forecast?${base}&hourly=${WEATHER_PARAMS.join(",")}`),
    getJSON<OpenMeteoHourly>(
      `https://air-quality-api.open-meteo.com/v1/air-quality?${base}&hourly=${AIR_PARAMS.join(",")}`,
    ).catch(() => null),
  ])

  const time = weather.hourly.time
  const values: CitySeries["values"] = {}
  const units: CitySeries["units"] = {}

  for (const p of WEATHER_PARAMS) {
    values[p] = weather.hourly[p] ?? []
    units[p] = weather.hourly_units[p] ?? ""
  }

  if (air) {
    const index = new Map(air.hourly.time.map((t, i) => [t, i]))
    for (const p of AIR_PARAMS) {
      const src = air.hourly[p] ?? []
      values[p] = time.map((t) => {
        const i = index.get(t)
        return i == null ? null : (src[i] ?? null)
      })
      units[p] = air.hourly_units[p] ?? ""
    }
  }

  return { time, values, units, fetchedAt: Date.now(), airAvailable: Boolean(air) }
}

export function almatyNow(): string {
  return new Date().toLocaleString("sv-SE", { timeZone: "Asia/Almaty" }).slice(0, 16).replace(" ", "T")
}

export function lastPastIndex(time: string[]): number {
  const now = almatyNow()
  let idx = -1
  for (let i = 0; i < time.length; i++) if (time[i] <= now) idx = i
  return idx
}

export function latestValue(s: CitySeries, p: Param): { value: number; time: string } | null {
  const v = s.values[p]
  if (!v) return null
  for (let i = lastPastIndex(s.time); i >= 0; i--) {
    const x = v[i]
    if (x != null) return { value: x, time: s.time[i] }
  }
  return null
}

function circularMean(values: number[]) {
  let sin = 0
  let cos = 0
  for (const a of values) {
    sin += Math.sin((a * Math.PI) / 180)
    cos += Math.cos((a * Math.PI) / 180)
  }
  return ((Math.atan2(sin, cos) * 180) / Math.PI + 360) % 360
}

function mean(values: (number | null)[], direction: boolean) {
  const x = values.filter((v): v is number => v != null)
  if (!x.length) return null
  return direction ? circularMean(x) : x.reduce((a, b) => a + b, 0) / x.length
}

export type ChartPoint = { t: string; v: number | null }

export type PeriodStats = {
  mean: number | null
  min: number | null
  max: number | null
  change: number | null
  missingPct: number
  daysAboveGuideline: number | null
  totalDays: number
  points: ChartPoint[]
  daily: boolean
}

export function periodStats(s: CitySeries, p: Param, hours: number): PeriodStats | null {
  const v = s.values[p]
  if (!v) return null
  const end = lastPastIndex(s.time)
  if (end < 0) return null
  const start = Math.max(0, end - hours + 1)
  const direction = p === "wind_direction_10m"
  const cur = v.slice(start, end + 1)
  const curTimes = s.time.slice(start, end + 1)
  const present = cur.filter((x): x is number => x != null)
  if (!present.length) return null

  const m = mean(cur, direction)
  const prevStart = start - hours
  const prevMean = prevStart >= 0 ? mean(v.slice(prevStart, start), direction) : null

  const byDay = new Map<string, (number | null)[]>()
  curTimes.forEach((t, i) => {
    const d = t.slice(0, 10)
    if (!byDay.has(d)) byDay.set(d, [])
    byDay.get(d)!.push(cur[i])
  })

  const guideline = WHO_GUIDELINE[p]
  let daysAbove: number | null = null
  if (guideline != null) {
    daysAbove = 0
    for (const vals of byDay.values()) {
      const dm = mean(vals, false)
      if (dm != null && dm > guideline) daysAbove++
    }
  }

  const daily = hours > 24 * 7
  const points: ChartPoint[] = daily
    ? [...byDay.entries()].map(([d, vals]) => ({ t: d, v: mean(vals, direction) }))
    : curTimes.map((t, i) => ({ t, v: cur[i] }))

  return {
    mean: m,
    min: Math.min(...present),
    max: Math.max(...present),
    change: !direction && m != null && prevMean != null ? m - prevMean : null,
    missingPct: (100 * (cur.length - present.length)) / cur.length,
    daysAboveGuideline: daysAbove,
    totalDays: byDay.size,
    points,
    daily,
  }
}

export function formatValue(v: number | null | undefined, p: Param) {
  if (v == null || Number.isNaN(v)) return "—"
  return v.toFixed(DECIMALS[p] ?? 1)
}

export function compassIndex(deg: number) {
  return Math.round(deg / 45) % 8
}
