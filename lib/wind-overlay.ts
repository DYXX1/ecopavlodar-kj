import type * as Leaflet from "leaflet"

const GRID = { s: 49.5, w: 72.5, rows: 7, cols: 8 }
const POINTS: [number, number][] = []
for (let r = 0; r < GRID.rows; r++) for (let c = 0; c < GRID.cols; c++) POINTS.push([GRID.s + r, GRID.w + c])

const GRID_WEATHER = ["wind_speed_10m", "wind_direction_10m", "temperature_2m", "precipitation", "relative_humidity_2m"]
const GRID_AIR = ["pm2_5", "pm10", "nitrogen_dioxide", "sulphur_dioxide"]

export const OVERLAY_LAYERS = [
  "wind_speed_10m",
  "temperature_2m",
  "precipitation",
  "relative_humidity_2m",
  "pm2_5",
  "pm10",
  "nitrogen_dioxide",
  "sulphur_dioxide",
] as const
export type OverlayLayer = (typeof OVERLAY_LAYERS)[number] | "off"

const WIND = ["#3d6fb4", "#4fb5c9", "#6fd08c", "#d8e35a", "#f7b23b", "#e8553a", "#a1255a"]
const AIR = ["#4f9d69", "#a9c75a", "#e9c74a", "#e48b3a", "#c8442e", "#7b2d5a"]

export const OVERLAY_SCALE: Record<Exclude<OverlayLayer, "off">, { range: [number, number]; colors: string[]; who?: number }> = {
  wind_speed_10m: { range: [0, 60], colors: WIND },
  temperature_2m: {
    range: [-40, 40],
    colors: ["#5b2c83", "#2b5fd9", "#3fb7e6", "#7fd6b0", "#f4e04d", "#f08a24", "#d7301f", "#7f0000"],
  },
  precipitation: { range: [0, 10], colors: ["#cfe8ff", "#7ec0ff", "#3a8dff", "#2b4fd1", "#7b2fbe", "#c2188a"] },
  relative_humidity_2m: { range: [0, 100], colors: ["#f5e6c8", "#a8d5ba", "#4fb5c9", "#2b6cb0", "#1b2f7a"] },
  pm2_5: { range: [0, 75], colors: AIR, who: 15 },
  pm10: { range: [0, 150], colors: AIR, who: 45 },
  nitrogen_dioxide: { range: [0, 100], colors: AIR, who: 25 },
  sulphur_dioxide: { range: [0, 200], colors: AIR, who: 40 },
}

export type GridData = {
  time: string[]
  nowIndex: number
  fields: Record<string, (number | null)[][]>
  units: Record<string, string>
  airAvailable: boolean
  fetchedAt: number
}

type Multi = { hourly: Record<string, (number | null)[]> & { time: string[] }; hourly_units: Record<string, string> }

export async function fetchGrid(): Promise<GridData> {
  const loc = `latitude=${POINTS.map((p) => p[0]).join(",")}&longitude=${POINTS.map((p) => p[1]).join(",")}&timezone=Asia%2FAlmaty&past_days=1&forecast_days=3`
  const get = async (url: string) => {
    const r = await fetch(url)
    if (!r.ok) throw new Error(`Open-Meteo ${r.status}`)
    return ([] as Multi[]).concat(await r.json())
  }
  const [w, a] = await Promise.all([
    get(`https://api.open-meteo.com/v1/forecast?${loc}&hourly=${GRID_WEATHER.join(",")}`),
    get(`https://air-quality-api.open-meteo.com/v1/air-quality?${loc}&hourly=${GRID_AIR.join(",")}`).catch(() => null),
  ])
  if (w.length !== POINTS.length) throw new Error("Unexpected grid size")

  const time = w[0].hourly.time
  const fields: GridData["fields"] = {}
  const units: GridData["units"] = {}
  for (const v of GRID_WEATHER) {
    fields[v] = w.map((o) => o.hourly[v])
    units[v] = w[0].hourly_units[v]
  }
  const airAvailable = Boolean(a && a.length === POINTS.length)
  if (a && airAvailable) {
    const idx = new Map(a[0].hourly.time.map((t, i) => [t, i]))
    for (const v of GRID_AIR) {
      fields[v] = a.map((o) => time.map((t) => (idx.has(t) ? (o.hourly[v][idx.get(t)!] ?? null) : null)))
      units[v] = a[0].hourly_units[v]
    }
  }

  const now = new Date().toLocaleString("sv-SE", { timeZone: "Asia/Almaty" }).slice(0, 16).replace(" ", "T")
  let nowIndex = 0
  time.forEach((t, i) => {
    if (t <= now) nowIndex = i
  })
  return { time, nowIndex, fields, units, airAvailable, fetchedAt: Date.now() }
}

const hexToRgb = (s: string) => [1, 3, 5].map((i) => Number.parseInt(s.slice(i, i + 2), 16))
const rgbCache = new Map<string, number[][]>()
function rgbAt(colors: string[], q: number) {
  let cols = rgbCache.get(colors.join())
  if (!cols) {
    cols = colors.map(hexToRgb)
    rgbCache.set(colors.join(), cols)
  }
  q = Math.max(0, Math.min(1, q))
  const x = q * (cols.length - 1)
  const i = Math.min(Math.floor(x), cols.length - 2)
  const g = x - i
  return cols[i].map((v, k) => Math.round(v + (cols[i + 1][k] - v) * g))
}

const PARTICLE_COLORS = Array.from({ length: 32 }, (_, i) => `rgb(${rgbAt(WIND, i / 31)})`)
const K = 0.04

/** Canvas wind-particle and colour-field overlay rendered in Leaflet panes so it pans with the map. */
export class WindOverlay {
  private fc: HTMLCanvasElement
  private pc: HTMLCanvasElement
  private cf: CanvasRenderingContext2D
  private cp: CanvasRenderingContext2D
  private g: GridData | null = null
  private ti = 0
  private layer: OverlayLayer = "wind_speed_10m"
  private particles = true
  private visible = true
  private raf = 0
  private last = 0
  private U: Float32Array | null = null
  private V: Float32Array | null = null
  private rw = 0
  private rh = 0
  private X = new Float32Array(0)
  private Y = new Float32Array(0)
  private Ag = new Int16Array(0)
  private n = 0
  private ox = 0
  private oy = 0
  private tl: Leaflet.LatLng | null = null
  private resizeTimer = 0
  private density: number

  constructor(
    private L: typeof Leaflet,
    private map: Leaflet.Map,
  ) {
    this.density = window.innerWidth < 600 ? 600 : 1300
    this.fc = document.createElement("canvas")
    this.pc = document.createElement("canvas")
    const fieldPane = map.createPane("wxf")
    fieldPane.style.zIndex = "350"
    const partPane = map.createPane("wxp")
    partPane.style.zIndex = "360"
    for (const c of [this.fc, this.pc]) {
      c.className = "leaflet-zoom-animated"
      c.style.position = "absolute"
      c.style.left = "0"
      c.style.top = "0"
      c.style.pointerEvents = "none"
    }
    fieldPane.appendChild(this.fc)
    partPane.appendChild(this.pc)
    this.cf = this.fc.getContext("2d")!
    this.cp = this.pc.getContext("2d")!

    map.on("zoomanim", this.onZoomAnim)
    map.on("moveend", this.onMoveEnd)
    map.on("resize", this.onResize)
    document.addEventListener("visibilitychange", this.onVisibility)
    this.size()
  }

  destroy() {
    this.stop()
    this.map.off("zoomanim", this.onZoomAnim)
    this.map.off("moveend", this.onMoveEnd)
    this.map.off("resize", this.onResize)
    document.removeEventListener("visibilitychange", this.onVisibility)
    this.fc.remove()
    this.pc.remove()
  }

  setData(g: GridData | null) {
    this.g = g
    if (!g) {
      this.stop()
      this.clear()
      return
    }
    this.ti = Math.min(this.ti || g.nowIndex, g.time.length - 1)
    this.redraw(true)
  }

  setTime(i: number) {
    if (!this.g) return
    this.ti = Math.max(0, Math.min(this.g.time.length - 1, i))
    this.redraw(false)
  }

  setLayer(layer: OverlayLayer) {
    this.layer = layer
    this.redraw(false)
  }

  setParticles(on: boolean) {
    this.particles = on
    if (on) this.start()
    else {
      this.stop()
      this.cp.clearRect(0, 0, this.pc.width, this.pc.height)
    }
  }

  setVisible(v: boolean) {
    if (v === this.visible) return
    this.visible = v
    if (v) this.redraw(true)
    else this.stop()
  }

  /** Bilinear model value at a point, or null outside the grid / missing data. */
  sample(layer: Exclude<OverlayLayer, "off">, lat: number, lon: number) {
    if (!this.g || !this.g.fields[layer]) return null
    return this.bil(lat, lon, (i) => this.val(layer, i))
  }

  private val(p: string, i: number) {
    const f = this.g?.fields[p]
    if (!f) return null
    const x = f[i]?.[this.ti]
    return x == null ? null : x
  }

  private uv(i: number): [number, number] | null {
    const s = this.val("wind_speed_10m", i)
    const d = this.val("wind_direction_10m", i)
    if (s == null || d == null) return null
    const r = (d * Math.PI) / 180
    return [-s * Math.sin(r), -s * Math.cos(r)] // d is the direction the wind comes FROM
  }

  private bil(lat: number, lon: number, fn: (i: number) => number | null) {
    const fy = lat - GRID.s
    const fx = lon - GRID.w
    if (fy < 0 || fx < 0 || fy > GRID.rows - 1 || fx > GRID.cols - 1) return null
    const r = Math.min(Math.floor(fy), GRID.rows - 2)
    const c = Math.min(Math.floor(fx), GRID.cols - 2)
    const ty = fy - r
    const tx = fx - c
    const n = [r * GRID.cols + c, r * GRID.cols + c + 1, (r + 1) * GRID.cols + c, (r + 1) * GRID.cols + c + 1]
    const w = [(1 - ty) * (1 - tx), (1 - ty) * tx, ty * (1 - tx), ty * tx]
    let s = 0
    for (let k = 0; k < 4; k++) {
      const x = fn(n[k])
      if (x == null) return null
      s += w[k] * x
    }
    return s
  }

  private place() {
    const s = this.map.getSize()
    this.ox = -Math.round(s.x * 0.25)
    this.oy = -Math.round(s.y * 0.25)
    this.tl = this.map.containerPointToLatLng([this.ox, this.oy])
    const o = this.map.containerPointToLayerPoint([this.ox, this.oy])
    this.L.DomUtil.setPosition(this.fc, o)
    this.L.DomUtil.setPosition(this.pc, o)
  }

  private size() {
    const s = this.map.getSize()
    for (const c of [this.fc, this.pc]) {
      c.width = Math.round(s.x * 1.5)
      c.height = Math.round(s.y * 1.5)
    }
    this.place()
  }

  private clear() {
    this.cf.clearRect(0, 0, this.fc.width, this.fc.height)
    this.cp.clearRect(0, 0, this.pc.width, this.pc.height)
  }

  private drawField() {
    this.cf.clearRect(0, 0, this.fc.width, this.fc.height)
    if (!this.g || this.layer === "off" || !this.g.fields[this.layer]) return
    const p = this.layer
    const { range, colors } = OVERLAY_SCALE[p]
    const [lo, hi] = range
    const step = 6
    for (let y = 0; y < this.fc.height; y += step)
      for (let x = 0; x < this.fc.width; x += step) {
        const ll = this.map.containerPointToLatLng([x + this.ox + step / 2, y + this.oy + step / 2])
        const v = this.bil(ll.lat, ll.lng, (i) => this.val(p, i))
        if (v == null || (p === "precipitation" && v < 0.05)) continue
        this.cf.fillStyle = `rgba(${rgbAt(colors, (v - lo) / (hi - lo))},.5)`
        this.cf.fillRect(x, y, step, step)
      }
  }

  private buildRaster() {
    const cs = 10
    this.rw = Math.ceil(this.pc.width / cs)
    this.rh = Math.ceil(this.pc.height / cs)
    this.U = new Float32Array(this.rw * this.rh).fill(Number.NaN)
    this.V = new Float32Array(this.rw * this.rh).fill(Number.NaN)
    if (!this.g) return
    for (let j = 0; j < this.rh; j++)
      for (let i = 0; i < this.rw; i++) {
        const ll = this.map.containerPointToLatLng([i * cs + 5 + this.ox, j * cs + 5 + this.oy])
        const u = this.bil(ll.lat, ll.lng, (k) => this.uv(k)?.[0] ?? null)
        const v = this.bil(ll.lat, ll.lng, (k) => this.uv(k)?.[1] ?? null)
        if (u != null && v != null) {
          this.U[j * this.rw + i] = u
          this.V[j * this.rw + i] = v
        }
      }
  }

  private spawn(k: number) {
    this.X[k] = Math.random() * this.pc.width
    this.Y[k] = Math.random() * this.pc.height
    this.Ag[k] = (20 + Math.random() * 80) | 0
  }

  private resetParticles() {
    this.n = Math.round(this.density * 2.25)
    this.X = new Float32Array(this.n)
    this.Y = new Float32Array(this.n)
    this.Ag = new Int16Array(this.n)
    for (let k = 0; k < this.n; k++) this.spawn(k)
  }

  private frame = (ts: number) => {
    this.raf = requestAnimationFrame(this.frame)
    if (ts - this.last < 33 || !this.U || !this.V) return
    this.last = ts
    const { cp, pc } = this
    cp.globalCompositeOperation = "destination-out"
    cp.fillStyle = "rgba(0,0,0,.12)"
    cp.fillRect(0, 0, pc.width, pc.height)
    cp.globalCompositeOperation = "source-over"
    cp.lineWidth = 1.4
    const coloured = this.layer === "wind_speed_10m"
    for (let k = 0; k < this.n; k++) {
      const px = this.X[k]
      const py = this.Y[k]
      if (px < 0 || py < 0 || px >= pc.width || py >= pc.height || this.Ag[k]-- <= 0) {
        this.spawn(k)
        continue
      }
      const id = ((py / 10) | 0) * this.rw + ((px / 10) | 0)
      const u = this.U[id]
      const v = this.V[id]
      if (Number.isNaN(u)) {
        this.spawn(k)
        continue
      }
      const sp = Math.hypot(u, v)
      const nx = px + u * K
      const ny = py - v * K // v is northward; screen y points down
      cp.strokeStyle = coloured ? PARTICLE_COLORS[Math.min(31, ((sp / 60) * 32) | 0)] : "rgba(28,58,42,.7)"
      cp.beginPath()
      cp.moveTo(px, py)
      cp.lineTo(nx, ny)
      cp.stroke()
      this.X[k] = nx
      this.Y[k] = ny
    }
  }

  private start() {
    if (!this.raf && this.visible && this.particles && this.U && !document.hidden)
      this.raf = requestAnimationFrame(this.frame)
  }

  private stop() {
    cancelAnimationFrame(this.raf)
    this.raf = 0
  }

  private redraw(full: boolean) {
    if (!this.g || !this.visible || !this.map.getSize().x) return
    if (full) this.size()
    else this.place()
    this.drawField()
    this.buildRaster()
    if (full || this.n === 0) {
      this.resetParticles()
      this.cp.clearRect(0, 0, this.pc.width, this.pc.height)
    }
    this.start()
  }

  private onZoomAnim = (e: Leaflet.ZoomAnimEvent) => {
    if (!this.tl) return
    const scale = this.map.getZoomScale(e.zoom)
    // biome-ignore lint: Leaflet exposes no public API for this zoom-animation transform
    const off = (this.map as any)._latLngToNewLayerPoint(this.tl, e.zoom, e.center)
    this.L.DomUtil.setTransform(this.fc, off, scale)
    this.L.DomUtil.setTransform(this.pc, off, scale)
  }

  private onMoveEnd = () => {
    if (!this.g) return
    this.redraw(false)
    this.cp.clearRect(0, 0, this.pc.width, this.pc.height)
  }

  private onResize = () => {
    window.clearTimeout(this.resizeTimer)
    this.resizeTimer = window.setTimeout(() => this.redraw(true), 120)
  }

  private onVisibility = () => {
    if (document.hidden) this.stop()
    else this.start()
  }
}
