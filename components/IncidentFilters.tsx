"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, Filter, ChevronDown } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

export function IncidentFilters() {
  const { incidents, filters, searchTerm, setFilters, setSearchTerm } = useAppContext()
  const [isOpen, setIsOpen] = useState(false)

  // Obtener opciones únicas para los filtros
  const tiposUnicos = [...new Set(incidents.map((i) => i.tipo))].sort()
  const estadosUnicos = [...new Set(incidents.map((i) => i.estado))].sort()
  const añosUnicos = [...new Set(incidents.map((i) => new Date(i.fechaHora).getFullYear().toString()))].sort()
  const mesesUnicos = [...new Set(incidents.map((i) => (new Date(i.fechaHora).getMonth() + 1).toString()))].sort(
    (a, b) => Number.parseInt(a) - Number.parseInt(b),
  )

  const mesesNombres: { [key: string]: string } = {
    "1": "Enero",
    "2": "Febrero",
    "3": "Marzo",
    "4": "Abril",
    "5": "Mayo",
    "6": "Junio",
    "7": "Julio",
    "8": "Agosto",
    "9": "Septiembre",
    "10": "Octubre",
    "11": "Noviembre",
    "12": "Diciembre",
  }

  const handleFilterChange = (filterType: keyof typeof filters, value: string, checked: boolean) => {
    const currentFilter = filters[filterType]
    const newFilter = checked ? [...currentFilter, value] : currentFilter.filter((item) => item !== value)

    setFilters({ [filterType]: newFilter })
  }

  const clearAllFilters = () => {
    setFilters({
      tipo: [],
      estado: [],
      año: [],
      mes: [],
    })
    setSearchTerm("")
  }

  const hasActiveFilters = Object.values(filters).some((filter) => filter.length > 0) || searchTerm

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filtros y Búsqueda
          </CardTitle>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm">
                <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Buscador */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por ID, tipo, ubicación, estado u operador..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Filtro por Tipo */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Tipo de Incidente</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {tiposUnicos.map((tipo) => (
                    <div key={tipo} className="flex items-center space-x-2">
                      <Checkbox
                        id={`tipo-${tipo}`}
                        checked={filters.tipo.includes(tipo)}
                        onCheckedChange={(checked) => handleFilterChange("tipo", tipo, checked as boolean)}
                      />
                      <Label htmlFor={`tipo-${tipo}`} className="text-sm">
                        {tipo}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro por Estado */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Estado</Label>
                <div className="space-y-2">
                  {estadosUnicos.map((estado) => (
                    <div key={estado} className="flex items-center space-x-2">
                      <Checkbox
                        id={`estado-${estado}`}
                        checked={filters.estado.includes(estado)}
                        onCheckedChange={(checked) => handleFilterChange("estado", estado, checked as boolean)}
                      />
                      <Label htmlFor={`estado-${estado}`} className="text-sm">
                        {estado}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro por Año */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Año</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {añosUnicos.map((año) => (
                    <div key={año} className="flex items-center space-x-2">
                      <Checkbox
                        id={`año-${año}`}
                        checked={filters.año.includes(año)}
                        onCheckedChange={(checked) => handleFilterChange("año", año, checked as boolean)}
                      />
                      <Label htmlFor={`año-${año}`} className="text-sm">
                        {año}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Filtro por Mes */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Mes</Label>
                <div className="space-y-2 max-h-32 overflow-y-auto">
                  {mesesUnicos.map((mes) => (
                    <div key={mes} className="flex items-center space-x-2">
                      <Checkbox
                        id={`mes-${mes}`}
                        checked={filters.mes.includes(mes)}
                        onCheckedChange={(checked) => handleFilterChange("mes", mes, checked as boolean)}
                      />
                      <Label htmlFor={`mes-${mes}`} className="text-sm">
                        {mesesNombres[mes]}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Botón para limpiar filtros */}
            {hasActiveFilters && (
              <div className="flex justify-end">
                <Button variant="outline" size="sm" onClick={clearAllFilters}>
                  Limpiar todos los filtros
                </Button>
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
