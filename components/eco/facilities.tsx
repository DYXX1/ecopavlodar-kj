"use client"

import { Factory, Trash2, Upload } from "lucide-react"
import { useRef, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@/components/ui/empty"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { FACILITY_FIELDS, addFacilities, clearFacilities, parseFacilityFile, useFacilities } from "@/lib/facilities"
import { fill } from "@/lib/i18n"
import { useEco } from "./eco-provider"
import { SectionHeading } from "./section-heading"

export function Facilities() {
  const { t } = useEco()
  const items = useFacilities()
  const inputRef = useRef<HTMLInputElement>(null)
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null)

  async function onFile(file: File | undefined) {
    if (!file) return
    try {
      const { ok, skipped } = parseFacilityFile(file.name, await file.text())
      addFacilities(ok)
      setMessage({ ok: true, text: fill(t.facilities.imported, { ok: ok.length, bad: skipped }) })
    } catch {
      setMessage({ ok: false, text: t.facilities.parseError })
    } finally {
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const importButton = (
    <Button onClick={() => inputRef.current?.click()} className="rounded-full">
      <Upload data-icon="inline-start" />
      {t.facilities.import}
    </Button>
  )

  return (
    <section id="facilities" className="bg-secondary/50 py-16">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <SectionHeading title={t.facilities.title} subtitle={t.facilities.subtitle} />
        <input
          ref={inputRef}
          type="file"
          accept=".json,.csv,application/json,text/csv"
          className="sr-only"
          aria-label={t.facilities.chooseFile}
          onChange={(e) => onFile(e.target.files?.[0])}
        />

        {message && (
          <Alert variant={message.ok ? "default" : "destructive"} className="mb-4" aria-live="polite">
            <AlertDescription>{message.text}</AlertDescription>
          </Alert>
        )}

        <Card>
          {items.length === 0 ? (
            <CardContent>
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Factory />
                  </EmptyMedia>
                  <EmptyTitle>{t.facilities.emptyTitle}</EmptyTitle>
                  <EmptyDescription>{t.facilities.emptyDesc}</EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  {importButton}
                  <p className="max-w-md text-xs text-muted-foreground">
                    {t.facilities.importDesc} <code className="break-words font-mono">{FACILITY_FIELDS.join(", ")}</code>
                  </p>
                </EmptyContent>
              </Empty>
            </CardContent>
          ) : (
            <>
              <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <CardTitle className="font-serif text-xl">
                    {t.facilities.importTitle} · {items.length}
                  </CardTitle>
                  <CardDescription>
                    {t.facilities.importDesc} <code className="font-mono text-xs">{FACILITY_FIELDS.join(", ")}</code>
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {importButton}
                  <Button
                    variant="outline"
                    className="rounded-full"
                    onClick={() => {
                      clearFacilities()
                      setMessage(null)
                    }}
                  >
                    <Trash2 data-icon="inline-start" />
                    {t.facilities.clear}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.facilities.cols.name}</TableHead>
                      <TableHead>{t.facilities.cols.type}</TableHead>
                      <TableHead>{t.facilities.cols.coords}</TableHead>
                      <TableHead>{t.facilities.cols.status}</TableHead>
                      <TableHead>{t.facilities.cols.source}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((o, i) => (
                      <TableRow key={`${o.name}-${i}`}>
                        <TableCell className="font-medium">{o.name}</TableCell>
                        <TableCell className="text-muted-foreground">{o.type || "—"}</TableCell>
                        <TableCell className="tabular-nums">
                          {o.lat.toFixed(4)}, {o.lon.toFixed(4)}
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            <Badge variant={o.status === "verified" ? "default" : "secondary"}>
                              {o.status === "verified" ? t.facilities.verified : t.facilities.needsCheck}
                            </Badge>
                            <Badge variant="outline">
                              {o.origin === "official" ? t.facilities.official : t.facilities.manual}
                            </Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          {o.url && /^https?:\/\//.test(o.url) ? (
                            <a
                              href={o.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary underline-offset-4 hover:underline"
                            >
                              {o.source || "link"}
                            </a>
                          ) : (
                            o.source || "—"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </>
          )}
        </Card>
      </div>
    </section>
  )
}
