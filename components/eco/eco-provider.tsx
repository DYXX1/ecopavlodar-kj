"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"
import useSWR from "swr"
import {
  CITIES,
  DEFAULT_START,
  fetchCitySeries,
  todayAlmaty,
  type City,
  type DateRange,
  type Lang,
} from "@/lib/eco-data"
import { DICT, type Dict } from "@/lib/i18n"

type EcoContextValue = {
  lang: Lang
  setLang: (l: Lang) => void
  t: Dict
  city: City
  setCityId: (id: string) => void
  range: DateRange
  setRange: (r: DateRange) => void
}

const EcoContext = createContext<EcoContextValue | null>(null)

export function EcoProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("ru")
  const [cityId, setCityId] = useState(CITIES[0].id)
  const [range, setRange] = useState<DateRange>(() => ({ start: DEFAULT_START, end: todayAlmaty() }))

  useEffect(() => {
    const saved = window.localStorage.getItem("eco_lang")
    if (saved === "ru" || saved === "kk" || saved === "en") setLangState(saved)
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const setLang = useCallback((l: Lang) => {
    setLangState(l)
    window.localStorage.setItem("eco_lang", l)
  }, [])

  const value = useMemo<EcoContextValue>(
    () => ({
      lang,
      setLang,
      t: DICT[lang],
      city: CITIES.find((c) => c.id === cityId) ?? CITIES[0],
      setCityId,
      range,
      setRange,
    }),
    [lang, setLang, cityId, range],
  )

  return <EcoContext.Provider value={value}>{children}</EcoContext.Provider>
}

export function useEco() {
  const ctx = useContext(EcoContext)
  if (!ctx) throw new Error("useEco must be used inside EcoProvider")
  return ctx
}

/** Recent days + short forecast — for "right now" views. */
export function useCitySeries(city: City) {
  return useSWR(["city-series", city.id], () => fetchCitySeries(city.lat, city.lon), {
    revalidateOnFocus: false,
    dedupingInterval: 10 * 60 * 1000,
    refreshInterval: 30 * 60 * 1000,
  })
}

/** Hourly archive for the user-selected date range — for trends and AI analysis. */
export function useCityHistory(city: City) {
  const { range } = useEco()
  return useSWR(
    ["city-history", city.id, range.start, range.end],
    () => fetchCitySeries(city.lat, city.lon, range),
    { revalidateOnFocus: false, dedupingInterval: 30 * 60 * 1000, keepPreviousData: true },
  )
}
