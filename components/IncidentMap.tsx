"use client"

import { useRef, useMemo } from "react"
import { useAppContext } from "@/context/AppContext"
import type { Incident } from "@/context/AppContext"

// Simulación de mapa (en producción usarías Google Maps o Leaflet)
export function IncidentMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const { incidents, filters, searchTerm, setSelectedIncident, setCurrentView } = useAppContext()

  // Filtrar incidentes igual que en la tabla
  const filteredIncidents = useMemo(() => {
    let filtered = incidents

    if (filters.tipo.length > 0) {
      filtered = filtered.filter((incident) => filters.tipo.includes(incident.tipo))
    }
    if (filters.estado.length > 0) {
      filtered = filtered.filter((incident) => filters.estado.includes(incident.estado))
    }
    if (filters.año.length > 0) {
      filtered = filtered.filter((incident) => {
        const year = new Date(incident.fechaHora).getFullYear().toString()
        return filters.año.includes(year)
      })
    }
    if (filters.mes.length > 0) {
      filtered = filtered.filter((incident) => {
        const month = (new Date(incident.fechaHora).getMonth() + 1).toString()
        return filters.mes.includes(month)
      })
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (incident) =>
          incident.tipo.toLowerCase().includes(term) ||
          incident.ubicacion.toLowerCase().includes(term) ||
          incident.estado.toLowerCase().includes(term) ||
          incident.operador.toLowerCase().includes(term) ||
          incident.id.toLowerCase().includes(term),
      )
    }

    return filtered
  }, [incidents, filters, searchTerm])

  const getIncidentIcon = (tipo: string) => {
    switch (tipo) {
      case "Incendio":
        return "🚒"
      case "Accidente":
        return "🚑"
      case "Robo":
        return "🚓"
      case "Emergencia Médica":
        return "🚑"
      case "Desastre Natural":
        return "🌪️"
      default:
        return "📍"
    }
  }

  const getIncidentColor = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "#ef4444" // red
      case "En progreso":
        return "#f59e0b" // yellow
      case "Resuelto":
        return "#10b981" // green
      default:
        return "#6b7280" // gray
    }
  }

  const handleMarkerClick = (incident: Incident) => {
    setSelectedIncident(incident)
    setCurrentView("incident-detail")
  }

  return (
    <div className="space-y-4">
      <div className="bg-card border rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-4">Mapa de Incidentes</h3>

        {/* Leyenda */}
        <div className="mb-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <span>Pendiente</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <span>En progreso</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span>Resuelto</span>
          </div>
        </div>

        {/* Mapa simulado */}
        <div
          ref={mapRef}
          className="relative w-full h-96 bg-slate-100 dark:bg-slate-800 rounded-lg overflow-hidden"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23e2e8f0' fillOpacity='0.4'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        >
          {/* Marcadores de incidentes */}
          {filteredIncidents.map((incident, index) => (
            <div
              key={incident.id}
              className="absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-transform"
              style={{
                left: `${20 + (index % 5) * 15}%`,
                top: `${20 + Math.floor(index / 5) * 15}%`,
              }}
              onClick={() => handleMarkerClick(incident)}
              title={`${incident.tipo} - ${incident.ubicacion} (${incident.estado})`}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-white"
                style={{ backgroundColor: getIncidentColor(incident.estado) }}
              >
                <span className="text-xs">{getIncidentIcon(incident.tipo)}</span>
              </div>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 bg-black text-white text-xs px-2 py-1 rounded opacity-0 hover:opacity-100 transition-opacity whitespace-nowrap">
                {incident.tipo} - {incident.ubicacion}
              </div>
            </div>
          ))}

          {/* Mensaje si no hay incidentes */}
          {filteredIncidents.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
              No hay incidentes que mostrar con los filtros aplicados
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-muted-foreground">
          Mostrando {filteredIncidents.length} incidente(s) en el mapa
        </div>
      </div>
    </div>
  )
}
