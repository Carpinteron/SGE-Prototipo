"use client"

import { useState } from "react"
import { IncidentTable } from "./IncidentTable"
import { IncidentMap } from "./IncidentMap"
import { IncidentFilters } from "./IncidentFilters"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export function Dashboard() {
  const { setCurrentView } = useAppContext()
  const [viewMode, setViewMode] = useState<"table" | "map">("table")

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Panel de Incidentes</h2>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="flex rounded-lg border">
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="rounded-r-none"
            >
              Tabla
            </Button>
            <Button
              variant={viewMode === "map" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("map")}
              className="rounded-l-none"
            >
              Mapa
            </Button>
          </div>

          <Button onClick={() => setCurrentView("incident-form")} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Registrar Incidente
          </Button>
        </div>
      </div>

      <IncidentFilters />

      {viewMode === "table" ? <IncidentTable /> : <IncidentMap />}
    </div>
  )
}
