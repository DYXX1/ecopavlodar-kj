import {
  CITIES,
  WHO_GUIDELINE,
  fetchCitySeries,
  latestValue,
  type City,
  type CitySeries,
  type Param,
} from "./eco-data"
import { BUILTIN_FACILITIES, emissionLevel } from "./facilities"

const WHO_PARAMS = ["pm2_5", "pm10", "nitrogen_dioxide", "sulphur_dioxide"] as const satisfies readonly Param[]

function round(v: number | null, d = 1) {
  return v == null || !Number.isFinite(v) ? "—" : v.toFixed(d)
}

function avg(xs: number[]) {
  return xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : null
}

/** Month-by-month table so the model can reason about the whole period without raw hourly data. */
function monthlyTable(s: CitySeries) {
  const groups = new Map<string, number[]>()
  s.time.forEach((t, i) => {
    const m = t.slice(0, 7)
    if (!groups.has(m)) groups.set(m, [])
    groups.get(m)!.push(i)
  })

  const pick = (p: Param, idx: number[]) =>
    idx.map((i) => s.values[p]?.[i]).filter((v): v is number => v != null && Number.isFinite(v))

  const dailyMeans = (p: Param, idx: number[]) => {
    const days = new Map<string, number[]>()
    for (const i of idx) {
      const v = s.values[p]?.[i]
      if (v == null) continue
      const d = s.time[i].slice(0, 10)
      if (!days.has(d)) days.set(d, [])
      days.get(d)!.push(v)
    }
    return [...days.values()].map((xs) => avg(xs)!)
  }

  const header =
    "month | T mean/min/max °C | wind mean/max gust km/h | precip mm | AQI mean | PM2.5 mean/max-day | PM10 mean | NO2 mean | SO2 mean | CO mean | days>WHO (PM2.5/PM10/NO2/SO2)"
  const rows = [...groups.entries()].map(([m, idx]) => {
    const temp = pick("temperature_2m", idx)
    const pm25Days = dailyMeans("pm2_5", idx)
    const above = WHO_PARAMS.map((p) => dailyMeans(p, idx).filter((d) => d > WHO_GUIDELINE[p]!).length).join("/")
    return [
      m,
      `${round(avg(temp))}/${round(temp.length ? Math.min(...temp) : null)}/${round(temp.length ? Math.max(...temp) : null)}`,
      `${round(avg(pick("wind_speed_10m", idx)))}/${round(Math.max(0, ...pick("wind_gusts_10m", idx)), 0)}`,
      round(
        pick("precipitation", idx).reduce((a, b) => a + b, 0),
        1,
      ),
      round(avg(pick("european_aqi", idx)), 0),
      `${round(avg(pick("pm2_5", idx)))}/${round(pm25Days.length ? Math.max(...pm25Days) : null)}`,
      round(avg(pick("pm10", idx))),
      round(avg(pick("nitrogen_dioxide", idx))),
      round(avg(pick("sulphur_dioxide", idx))),
      round(avg(pick("carbon_monoxide", idx)), 0),
      above,
    ].join(" | ")
  })
  return [header, ...rows].join("\n")
}

function distanceKm(a: { lat: number; lon: number }, b: { lat: number; lon: number }) {
  const r = Math.PI / 180
  const x = (b.lon - a.lon) * r * Math.cos(((a.lat + b.lat) / 2) * r)
  const y = (b.lat - a.lat) * r
  return Math.sqrt(x * x + y * y) * 6371
}

function facilitiesSummary(city: City) {
  return BUILTIN_FACILITIES.map((f) => ({ f, d: distanceKm(city, f), lvl: emissionLevel(f.emissions) }))
    .sort((a, b) => b.lvl - a.lvl || a.d - b.d)
    .slice(0, 30)
    .map(({ f, d }) => `- ${f.name} (${f.type ?? "?"}), ${d.toFixed(0)} km from ${city.name.en}; emissions: ${f.emissions ?? "n/a"}`)
    .join("\n")
}

function currentSnapshot(s: CitySeries) {
  const params: Param[] = [
    "european_aqi",
    "pm2_5",
    "pm10",
    "nitrogen_dioxide",
    "sulphur_dioxide",
    "ozone",
    "carbon_monoxide",
    "temperature_2m",
    "relative_humidity_2m",
    "wind_speed_10m",
    "wind_direction_10m",
  ]
  return params
    .map((p) => {
      const v = latestValue(s, p)
      return v ? `${p}: ${round(v.value)} ${s.units[p] ?? ""} (at ${v.time})` : `${p}: n/a`
    })
    .join("\n")
}

export async function buildAnalysisContext(cityId: string, start: string, end: string) {
  const city = CITIES.find((c) => c.id === cityId) ?? CITIES[0]
  const [history, current] = await Promise.all([
    fetchCitySeries(city.lat, city.lon, { start, end }),
    fetchCitySeries(city.lat, city.lon),
  ])

  return {
    city,
    text: [
      `CITY: ${city.name.en} (${city.lat}, ${city.lon}), Pavlodar region, Kazakhstan. Timezone Asia/Almaty.`,
      `PERIOD: ${start} to ${end}. Source: Open-Meteo historical-forecast (weather) and CAMS air-quality model; model estimates, not station measurements.`,
      `WHO 2021 24h guidelines µg/m³: PM2.5 15, PM10 45, NO2 25, SO2 40, CO 4000; O3 8h 100. European AQI bands: 0-20 good, 20-40 fair, 40-60 moderate, 60-80 poor, 80-100 very poor, >100 extremely poor.`,
      "",
      "MONTHLY SUMMARY:",
      monthlyTable(history),
      "",
      "CURRENT VALUES (latest past hour):",
      currentSnapshot(current),
      "",
      "MAJOR INDUSTRIAL FACILITIES IN THE REGION:",
      facilitiesSummary(city),
    ].join("\n"),
  }
}
