"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { useAppContext } from "@/context/AppContext"

interface Involucrado {
  nombre: string
  documento: string
  contacto: string
}

export function IncidentForm() {
  const { addIncident, setCurrentView } = useAppContext()

  const [formData, setFormData] = useState({
    tipo: "",
    ubicacion: "",
    estado: "Pendiente" as const,
    descripcion: "",
    lat: 0,
    lng: 0,
  })

  const [involucrados, setInvolucrados] = useState<Involucrado[]>([{ nombre: "", documento: "", contacto: "" }])

  const [aceptaTerminos, setAceptaTerminos] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const tiposIncidente = ["Incendio", "Accidente", "Robo", "Emergencia Médica", "Desastre Natural", "Otro"]

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.tipo) newErrors.tipo = "El tipo de incidente es requerido"
    if (!formData.ubicacion) newErrors.ubicacion = "La ubicación es requerida"
    if (!formData.descripcion) newErrors.descripcion = "La descripción es requerida"
    if (!aceptaTerminos) newErrors.terminos = "Debe aceptar el tratamiento de datos personales"

    // Validar involucrados
    involucrados.forEach((involucrado, index) => {
      if (involucrado.nombre || involucrado.documento || involucrado.contacto) {
        if (!involucrado.nombre) newErrors[`involucrado-${index}-nombre`] = "Nombre requerido"
        if (!involucrado.documento) newErrors[`involucrado-${index}-documento`] = "Documento requerido"
        if (!involucrado.contacto) newErrors[`involucrado-${index}-contacto`] = "Contacto requerido"
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    // Filtrar involucrados vacíos
    const involucradosValidos = involucrados.filter((inv) => inv.nombre && inv.documento && inv.contacto)

    addIncident({
      ...formData,
      recursos: [],
      involucrados: involucradosValidos,
      // Coordenadas simuladas para Bogotá
      lat: 4.6097 + (Math.random() - 0.5) * 0.1,
      lng: -74.0817 + (Math.random() - 0.5) * 0.1,
    })

    setCurrentView("dashboard")
  }

  const addInvolucrado = () => {
    setInvolucrados([...involucrados, { nombre: "", documento: "", contacto: "" }])
  }

  const removeInvolucrado = (index: number) => {
    if (involucrados.length > 1) {
      setInvolucrados(involucrados.filter((_, i) => i !== index))
    }
  }

  const updateInvolucrado = (index: number, field: keyof Involucrado, value: string) => {
    const updated = [...involucrados]
    updated[index] = { ...updated[index], [field]: value }
    setInvolucrados(updated)
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="mb-6">
        <Button variant="ghost" onClick={() => setCurrentView("dashboard")} className="mb-4">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al Panel
        </Button>
        <h2 className="text-2xl font-bold">Registrar Nuevo Incidente</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Información del Incidente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo de Incidente *</Label>
                <Select value={formData.tipo} onValueChange={(value) => setFormData({ ...formData, tipo: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposIncidente.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.tipo && <p className="text-sm text-destructive">{errors.tipo}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ubicacion">Ubicación *</Label>
                <Input
                  id="ubicacion"
                  value={formData.ubicacion}
                  onChange={(e) => setFormData({ ...formData, ubicacion: e.target.value })}
                  placeholder="Dirección completa del incidente"
                />
                {errors.ubicacion && <p className="text-sm text-destructive">{errors.ubicacion}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descripcion">Descripción *</Label>
              <Textarea
                id="descripcion"
                value={formData.descripcion}
                onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                placeholder="Descripción detallada del incidente"
                rows={4}
              />
              {errors.descripcion && <p className="text-sm text-destructive">{errors.descripcion}</p>}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Involucrados
              <Button type="button" variant="outline" size="sm" onClick={addInvolucrado}>
                <Plus className="h-4 w-4 mr-2" />
                Agregar
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {involucrados.map((involucrado, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Involucrado {index + 1}</h4>
                  {involucrados.length > 1 && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => removeInvolucrado(index)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre Completo</Label>
                    <Input
                      value={involucrado.nombre}
                      onChange={(e) => updateInvolucrado(index, "nombre", e.target.value)}
                      placeholder="Nombre completo"
                    />
                    {errors[`involucrado-${index}-nombre`] && (
                      <p className="text-sm text-destructive">{errors[`involucrado-${index}-nombre`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Documento</Label>
                    <Input
                      value={involucrado.documento}
                      onChange={(e) => updateInvolucrado(index, "documento", e.target.value)}
                      placeholder="Número de documento"
                    />
                    {errors[`involucrado-${index}-documento`] && (
                      <p className="text-sm text-destructive">{errors[`involucrado-${index}-documento`]}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label>Contacto</Label>
                    <Input
                      value={involucrado.contacto}
                      onChange={(e) => updateInvolucrado(index, "contacto", e.target.value)}
                      placeholder="Teléfono o email"
                    />
                    {errors[`involucrado-${index}-contacto`] && (
                      <p className="text-sm text-destructive">{errors[`involucrado-${index}-contacto`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terminos"
                checked={aceptaTerminos}
                onCheckedChange={(checked) => setAceptaTerminos(checked as boolean)}
              />
              <Label htmlFor="terminos" className="text-sm">
                Acepto el tratamiento de datos personales según la Ley 1581/2012 *
              </Label>
            </div>
            {errors.terminos && <p className="text-sm text-destructive mt-2">{errors.terminos}</p>}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={() => setCurrentView("dashboard")}>
            Cancelar
          </Button>
          <Button type="submit">Registrar Incidente</Button>
        </div>
      </form>
    </div>
  )
}
