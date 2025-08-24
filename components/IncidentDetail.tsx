"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { ArrowLeft, MapPin, Clock, User, FileText, Users, Truck } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export function IncidentDetail() {
  const { selectedIncident, setCurrentView, updateIncident } = useAppContext()
  const [localIncident, setLocalIncident] = useState(selectedIncident)
  const [selectedResources, setSelectedResources] = useState<string[]>([])

  useEffect(() => {
    if (selectedIncident) {
      setLocalIncident(selectedIncident)
      // Map resource names back to IDs for the checkboxes
      const resourceIds = selectedIncident.recursos.map((resourceName) => {
        const resource = recursos.find((r) => r.name === resourceName)
        return resource ? resource.id : resourceName
      })
      setSelectedResources(resourceIds)
    }
  }, [selectedIncident])

  if (!localIncident) {
    return (
      <div className="container mx-auto p-4">
        <p>No se ha seleccionado ningún incidente.</p>
        <Button onClick={() => setCurrentView("dashboard")}>Volver al Panel</Button>
      </div>
    )
  }

  const recursos = [
    { id: "policia", name: "Policía", available: true },
    { id: "bomberos", name: "Bomberos", available: true },
    { id: "ambulancia", name: "Ambulancia", available: false },
  ]

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

  const getEstadoBadgeClass = (estado: string) => {
    switch (estado) {
      case "Pendiente":
        return "bg-red-500 hover:bg-red-600 text-white border-red-500" // Red
      case "En progreso":
        return "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500" // Yellow
      case "Resuelto":
        return "bg-green-500 hover:bg-green-600 text-white border-green-500" // Green
      default:
        return ""
    }
  }

  const getStatusButtonClass = (buttonStatus: string, currentStatus: string) => {
    const isActive = buttonStatus === currentStatus
    switch (buttonStatus) {
      case "Pendiente":
        return isActive
          ? "bg-red-500 hover:bg-red-600 text-white border-red-500"
          : "border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-950"
      case "En progreso":
        return isActive
          ? "bg-yellow-500 hover:bg-yellow-600 text-white border-yellow-500"
          : "border-yellow-500 text-yellow-600 hover:bg-yellow-50 dark:hover:bg-yellow-950"
      case "Resuelto":
        return isActive
          ? "bg-green-500 hover:bg-green-600 text-white border-green-500"
          : "border-green-500 text-green-600 hover:bg-green-50 dark:hover:bg-green-950"
      default:
        return ""
    }
  }

  const handleResourceChange = (resourceId: string, checked: boolean) => {
    if (localIncident.estado === "Resuelto") return

    const newResources = checked
      ? [...selectedResources, resourceId]
      : selectedResources.filter((r) => r !== resourceId)

    setSelectedResources(newResources)
  }

  const handleAssignResources = () => {
    if (localIncident.estado === "Resuelto") return

    const resourceNames = selectedResources.map((id) => recursos.find((r) => r.id === id)?.name || id)
    const newStatus = resourceNames.length > 0 ? "En progreso" : localIncident.estado

    updateIncident(localIncident.id, {
      recursos: resourceNames,
      estado: newStatus,
    })

    setLocalIncident((prev) => ({
      ...prev,
      recursos: resourceNames,
      estado: newStatus,
    }))

    console.log("[v0] Resources updated in real-time:", resourceNames)
  }

  const handleStatusChange = (newStatus: "Pendiente" | "En progreso" | "Resuelto") => {
    if (localIncident.estado === "Resuelto") return

    updateIncident(localIncident.id, { estado: newStatus })

    setLocalIncident((prev) => ({
      ...prev,
      estado: newStatus,
    }))

    console.log("[v0] Status updated in real-time:", newStatus)
  }

  const isResolved = localIncident.estado === "Resuelto"

  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setCurrentView("dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Panel
        </Button>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Detalle del Incidente #{localIncident.id}</h2>
          <Badge
            variant={getEstadoBadgeVariant(localIncident.estado)}
            className={`text-sm ${getEstadoBadgeClass(localIncident.estado)}`}
          >
            {localIncident.estado}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información Principal */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Información General
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tipo</Label>
                  <p className="text-lg">{localIncident.tipo}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Estado</Label>
                  <div className="flex gap-2 mt-1">
                    {!isResolved && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          className={getStatusButtonClass("Pendiente", localIncident.estado)}
                          onClick={() => handleStatusChange("Pendiente")}
                        >
                          Pendiente
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={getStatusButtonClass("En progreso", localIncident.estado)}
                          onClick={() => handleStatusChange("En progreso")}
                        >
                          En progreso
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className={getStatusButtonClass("Resuelto", localIncident.estado)}
                          onClick={() => handleStatusChange("Resuelto")}
                        >
                          Resuelto
                        </Button>
                      </>
                    )}
                    {isResolved && <Badge variant="secondary">Incidente resuelto - No editable</Badge>}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Ubicación
                </Label>
                <p className="text-lg">{localIncident.ubicacion}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Fecha y Hora
                </Label>
                <p className="text-lg">{new Date(localIncident.fechaHora).toLocaleString("es-CO")}</p>
              </div>

              <div>
                <Label className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Operador
                </Label>
                <p className="text-lg">{localIncident.operador}</p>
              </div>

              {localIncident.descripcion && (
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Descripción</Label>
                  <p className="text-base mt-1 p-3 bg-muted rounded-lg">{localIncident.descripcion}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Involucrados */}
          {localIncident.involucrados && localIncident.involucrados.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Involucrados
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {localIncident.involucrados.map((involucrado, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Nombre</Label>
                          <p>{involucrado.nombre}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Documento</Label>
                          <p>{involucrado.documento}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-muted-foreground">Contacto</Label>
                          <p>{involucrado.contacto}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Historial */}
          {localIncident.historial && localIncident.historial.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Historial de Cambios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {localIncident.historial.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3 pb-3 border-b last:border-b-0">
                      <div className="w-2 h-2 rounded-full bg-primary mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm">{entry.accion}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(entry.fecha).toLocaleString("es-CO")} - {entry.operador}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Panel Lateral */}
        <div className="space-y-6">
          {/* Mapa */}
          <Card>
            <CardHeader>
              <CardTitle>Ubicación en Mapa</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full h-48 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{localIncident.ubicacion}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recursos Asignados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                Recursos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Recursos Actuales</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {localIncident.recursos.length > 0 ? (
                    localIncident.recursos.map((recurso, index) => (
                      <Badge key={index} variant="outline">
                        {recurso}
                      </Badge>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">Sin recursos asignados</p>
                  )}
                </div>
              </div>

              {!isResolved && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Asignar Recursos</Label>
                    <div className="space-y-2 mt-2">
                      {recursos.map((recurso) => (
                        <div key={recurso.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={recurso.id}
                            checked={selectedResources.includes(recurso.id)}
                            onCheckedChange={(checked) => handleResourceChange(recurso.id, checked as boolean)}
                            disabled={!recurso.available}
                          />
                          <Label htmlFor={recurso.id} className="text-sm flex items-center gap-2">
                            {recurso.name}
                            {!recurso.available && (
                              <Badge variant="destructive" className="text-xs">
                                No disponible
                              </Badge>
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleAssignResources}
                    className="w-full"
                    disabled={
                      JSON.stringify(selectedResources.sort()) ===
                      JSON.stringify(
                        localIncident.recursos.map((r) => recursos.find((res) => res.name === r)?.id || r).sort(),
                      )
                    }
                  >
                    Actualizar Estado
                  </Button>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
