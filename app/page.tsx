"use client"

import dynamic from "next/dynamic"
import { About, SiteFooter } from "@/components/eco/about"
import { AirOverview } from "@/components/eco/air-overview"
import { EcoProvider } from "@/components/eco/eco-provider"
import { Facilities } from "@/components/eco/facilities"
import { Hero } from "@/components/eco/hero"
import { SiteHeader } from "@/components/eco/site-header"
import { Trends } from "@/components/eco/trends"

const WeatherMap = dynamic(() => import("@/components/eco/weather-map").then((m) => m.WeatherMap), { ssr: false })

export default function Page() {
  return (
    <EcoProvider>
      <SiteHeader />
      <main>
        <Hero />
        <AirOverview />
        <WeatherMap />
        <Trends />
        <Facilities />
        <About />
      </main>
      <SiteFooter />
    </EcoProvider>
  )
}
