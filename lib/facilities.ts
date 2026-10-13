import { useSyncExternalStore } from "react"

export type Facility = {
  name: string
  type?: string
  lat: number
  lon: number
  description?: string
  emissions?: string
  period?: string
  source?: string
  url?: string
  status?: string
  origin?: string
  comment?: string
}

export const FACILITY_FIELDS = [
  "name",
  "type",
  "lat",
  "lon",
  "description",
  "emissions",
  "period",
  "source",
  "url",
  "status",
  "origin",
  "comment",
] as const

const KEY = "eco_cat"
const EMPTY: Facility[] = []
const listeners = new Set<() => void>()
let cachedRaw: string | null = null
let cached: Facility[] = EMPTY

function read(): Facility[] {
  const raw = window.localStorage.getItem(KEY)
  if (raw === cachedRaw) return cached
  cachedRaw = raw
  try {
    const parsed = JSON.parse(raw ?? "[]")
    cached = Array.isArray(parsed) ? parsed : EMPTY
  } catch {
    cached = EMPTY
  }
  return cached
}

function write(list: Facility[]) {
  window.localStorage.setItem(KEY, JSON.stringify(list))
  listeners.forEach((l) => l())
}

function subscribe(cb: () => void) {
  listeners.add(cb)
  const onStorage = (e: StorageEvent) => e.key === KEY && cb()
  window.addEventListener("storage", onStorage)
  return () => {
    listeners.delete(cb)
    window.removeEventListener("storage", onStorage)
  }
}

export function useFacilities() {
  return useSyncExternalStore(subscribe, read, () => EMPTY)
}

export function addFacilities(items: Facility[]) {
  write([...read(), ...items])
}

export function clearFacilities() {
  write([])
}

function parseCsv(text: string): Record<string, string>[] {
  const rows: string[][] = []
  let row: string[] = []
  let cell = ""
  let quoted = false
  for (let i = 0; i < text.length; i++) {
    const ch = text[i]
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"'
        i++
      } else if (ch === '"') quoted = false
      else cell += ch
    } else if (ch === '"') quoted = true
    else if (ch === ",") {
      row.push(cell)
      cell = ""
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++
      row.push(cell)
      cell = ""
      if (row.some(Boolean)) rows.push(row)
      row = []
    } else cell += ch
  }
  if (cell || row.length) {
    row.push(cell)
    rows.push(row)
  }
  const header = (rows.shift() ?? []).map((h) => h.trim())
  return rows.map((r) => Object.fromEntries(header.map((k, i) => [k, r[i]])))
}

export function parseFacilityFile(name: string, text: string) {
  const raw: unknown = name.toLowerCase().endsWith(".csv") ? parseCsv(text) : JSON.parse(text)
  const list = (Array.isArray(raw) ? raw : [raw]) as Record<string, unknown>[]
  const ok: Facility[] = []
  for (const o of list) {
    const lat = Number.parseFloat(String(o.lat))
    const lon = Number.parseFloat(String(o.lon))
    if (o.name && Number.isFinite(lat) && Number.isFinite(lon)) {
      ok.push({ ...(o as Omit<Facility, "lat" | "lon">), name: String(o.name), lat, lon })
    }
  }
  return { ok, skipped: list.length - ok.length }
}

export function escapeHtml(s: unknown) {
  return String(s ?? "").replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c] as string,
  )
}
