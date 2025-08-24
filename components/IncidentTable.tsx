"use client"

import { useMemo } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from "lucide-react"
import { useAppContext } from "@/context/AppContext"
import type { Incident } from "@/context/AppContext"

export function IncidentTable() {
  const { incidents, filters, searchTerm, sortConfig, setSortConfig, setSelectedIncident, setCurrentView } =
    useAppContext()

  // Filtrar y buscar incidentes
  const filteredIncidents = useMemo(() => {
    let filtered = incidents

    // Aplicar filtros
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

    // Aplicar búsqueda
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

  // Ordenar incidentes
  const sortedIncidents = useMemo(() => {
    if (sortConfig.length === 0) return filteredIncidents

    return [...filteredIncidents].sort((a, b) => {
      for (const { key, direction } of sortConfig) {
        let aValue = a[key]
        let bValue = b[key]

        // Manejar diferentes tipos de datos
        if (key === "fechaHora") {
          aValue = new Date(aValue as string).getTime()
          bValue = new Date(bValue as string).getTime()
        } else if (key === "id") {
          aValue = Number.parseInt(aValue as string) || 0
          bValue = Number.parseInt(bValue as string) || 0
        } else if (typeof aValue === "string") {
          aValue = aValue.toLowerCase()
          bValue = (bValue as string).toLowerCase()
        }

        if (aValue < bValue) {
          return direction === "asc" ? -1 : 1
        }
        if (aValue > bValue) {
          return direction === "asc" ? 1 : -1
        }
      }
      return 0
    })
  }, [filteredIncidents, sortConfig])

  const handleSort = (key: keyof Incident) => {
    setSortConfig((prevConfig) => {
      const existingIndex = prevConfig.findIndex((config) => config.key === key)

      if (existingIndex >= 0) {
        // Si ya existe, cambiar dirección
        const newConfig = [...prevConfig]
        newConfig[existingIndex] = {
          ...newConfig[existingIndex],
          direction: newConfig[existingIndex].direction === "asc" ? "desc" : "asc",
        }
        return newConfig
      } else {
        // Si no existe, agregar al final
        return [...prevConfig, { key, direction: "asc" }]
      }
    })
  }

  const getSortIcon = (key: keyof Incident) => {
    const config = sortConfig.find((config) => config.key === key)
    if (!config) return <ArrowUpDown className="h-4 w-4" />
    return config.direction === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />
  }

  const getEstadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "destructive"
      case "En progreso":
        return "default"
      case "Resuelto":
        return "secondary"
      default:
        return "outline"
    }
  }

  const handleViewIncident = (incident: Incident) => {
    setSelectedIncident(incident)
    setCurrentView("incident-detail")
  }

  return (
    <div className="space-y-4">
      {/* Indicador de ordenamiento */}
      {sortConfig.length > 0 && (
        <div className="text-sm text-muted-foreground">
          Ordenando por:{" "}
          {sortConfig.map((config, index) => (
            <span key={config.key}>
              {index > 0 && ", luego "}
              {config.key} {config.direction === "asc" ? "↑" : "↓"}
            </span>
          ))}
          <Button variant="ghost" size="sm" onClick={() => setSortConfig([])} className="ml-2 h-6 px-2">
            Limpiar
          </Button>
        </div>
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("id")} className="h-8 px-2">
                  ID {getSortIcon("id")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("tipo")} className="h-8 px-2">
                  Tipo {getSortIcon("tipo")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("ubicacion")} className="h-8 px-2">
                  Ubicación {getSortIcon("ubicacion")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("estado")} className="h-8 px-2">
                  Estado {getSortIcon("estado")}
                </Button>
              </TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("fechaHora")} className="h-8 px-2">
                  Fecha/Hora {getSortIcon("fechaHora")}
                </Button>
              </TableHead>
              <TableHead>Recursos</TableHead>
              <TableHead>
                <Button variant="ghost" onClick={() => handleSort("operador")} className="h-8 px-2">
                  Operador {getSortIcon("operador")}
                </Button>
              </TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedIncidents.map((incident) => (
              <TableRow key={incident.id}>
                <TableCell className="font-mono">{incident.id}</TableCell>
                <TableCell>{incident.tipo}</TableCell>
                <TableCell>{incident.ubicacion}</TableCell>
                <TableCell>
                  <Badge variant={getEstadoBadgeVariant(incident.estado)}>{incident.estado}</Badge>
                </TableCell>
                <TableCell>{new Date(incident.fechaHora).toLocaleString("es-CO")}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {incident.recursos.map((recurso, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {recurso}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{incident.operador}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm" onClick={() => handleViewIncident(incident)}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedIncidents.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          No se encontraron incidentes que coincidan con los filtros aplicados.
        </div>
      )}
    </div>
  )
}
