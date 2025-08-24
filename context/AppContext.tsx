"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export interface Incident {
  id: string
  tipo: string
  ubicacion: string
  estado: "Pendiente" | "En progreso" | "Resuelto"
  fechaHora: string
  recursos: string[]
  operador: string
  descripcion?: string
  involucrados?: Array<{
    nombre: string
    documento: string
    contacto: string
  }>
  historial?: Array<{
    fecha: string
    accion: string
    operador: string
  }>
  lat?: number
  lng?: number
}

export interface User {
  authenticated: boolean
  name: string
  role: string
}

export interface AppState {
  user: User
  currentView: "dashboard" | "incident-detail" | "incident-form"
  selectedIncident: Incident | null
  incidents: Incident[]
  filters: {
    tipo: string[]
    estado: string[]
    año: string[]
    mes: string[]
  }
  searchTerm: string
  sortConfig: Array<{
    key: keyof Incident
    direction: "asc" | "desc"
  }>
}

interface AppContextType extends AppState {
  login: (username: string, password: string) => boolean
  logout: () => void
  setCurrentView: (view: AppState["currentView"]) => void
  setSelectedIncident: (incident: Incident | null) => void
  addIncident: (incident: Omit<Incident, "id" | "fechaHora" | "operador">) => void
  updateIncident: (id: string, updates: Partial<Incident>) => void
  setFilters: (filters: Partial<AppState["filters"]>) => void
  setSearchTerm: (term: string) => void
  setSortConfig: (config: AppState["sortConfig"] | ((prev: AppState["sortConfig"]) => AppState["sortConfig"])) => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

// Datos ficticios iniciales
const initialIncidents: Incident[] = [
  {
    id: "001",
    tipo: "Incendio",
    ubicacion: "Calle 123 #45-67",
    estado: "Pendiente",
    fechaHora: "2024-01-15T10:30:00",
    recursos: [],
    operador: "Juan Pérez",
    descripcion: "Incendio en edificio residencial",
    lat: 4.6097,
    lng: -74.0817,
  },
  {
    id: "002",
    tipo: "Accidente",
    ubicacion: "Carrera 7 con Calle 26",
    estado: "En progreso",
    fechaHora: "2024-01-15T09:15:00",
    recursos: ["Ambulancia", "Policía"],
    operador: "María García",
    descripcion: "Accidente de tránsito con heridos",
    lat: 4.6118,
    lng: -74.0723,
  },
  {
    id: "003",
    tipo: "Robo",
    ubicacion: "Centro Comercial Plaza",
    estado: "Resuelto",
    fechaHora: "2024-01-14T16:45:00",
    recursos: ["Policía"],
    operador: "Carlos López",
    descripcion: "Robo a mano armada en local comercial",
    lat: 4.6351,
    lng: -74.0703,
  },
  {
    id: "004",
    tipo: "Emergencia Médica",
    ubicacion: "Parque Nacional",
    estado: "Pendiente",
    fechaHora: "2024-01-15T11:20:00",
    recursos: [],
    operador: "Ana Rodríguez",
    descripcion: "Persona inconsciente en el parque",
    lat: 4.6126,
    lng: -74.0705,
  },
  {
    id: "005",
    tipo: "Desastre Natural",
    ubicacion: "Barrio La Candelaria",
    estado: "En progreso",
    fechaHora: "2024-01-15T08:00:00",
    recursos: ["Bomberos", "Ambulancia"],
    operador: "Luis Martínez",
    descripcion: "Deslizamiento de tierra",
    lat: 4.5981,
    lng: -74.0758,
  },
]

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: { authenticated: false, name: "", role: "" },
    currentView: "dashboard",
    selectedIncident: null,
    incidents: initialIncidents,
    filters: {
      tipo: [],
      estado: [],
      año: [],
      mes: [],
    },
    searchTerm: "",
    sortConfig: [],
  })

  // Cargar datos del localStorage
  useEffect(() => {
    const savedIncidents = localStorage.getItem("emergency-incidents")
    if (savedIncidents) {
      setState((prev) => ({
        ...prev,
        incidents: JSON.parse(savedIncidents),
      }))
    }
  }, [])

  // Guardar incidentes en localStorage
  useEffect(() => {
    localStorage.setItem("emergency-incidents", JSON.stringify(state.incidents))
  }, [state.incidents])

  const login = (username: string, password: string): boolean => {
    // Login ficticio
    if (username === "admin" && password === "admin123") {
      setState((prev) => ({
        ...prev,
        user: { authenticated: true, name: "Administrador", role: "admin" },
      }))
      return true
    }
    return false
  }

  const logout = () => {
    setState((prev) => ({
      ...prev,
      user: { authenticated: false, name: "", role: "" },
      currentView: "dashboard",
    }))
  }

  const setCurrentView = (view: AppState["currentView"]) => {
    setState((prev) => ({ ...prev, currentView: view }))
  }

  const setSelectedIncident = (incident: Incident | null) => {
    setState((prev) => ({ ...prev, selectedIncident: incident }))
  }

  const addIncident = (incidentData: Omit<Incident, "id" | "fechaHora" | "operador">) => {
    const newIncident: Incident = {
      ...incidentData,
      id: Date.now().toString(),
      fechaHora: new Date().toISOString(),
      operador: state.user.name,
      historial: [
        {
          fecha: new Date().toISOString(),
          accion: "Incidente registrado",
          operador: state.user.name,
        },
      ],
    }

    setState((prev) => ({
      ...prev,
      incidents: [...prev.incidents, newIncident],
    }))
  }

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setState((prev) => ({
      ...prev,
      incidents: prev.incidents.map((incident) => {
        if (incident.id === id) {
          const updatedIncident = { ...incident, ...updates }

          // Agregar al historial si hay cambios significativos
          if (updates.estado || updates.recursos) {
            const historialEntry = {
              fecha: new Date().toISOString(),
              accion: updates.estado ? `Estado cambiado a ${updates.estado}` : "Recursos actualizados",
              operador: prev.user.name,
            }
            updatedIncident.historial = [...(incident.historial || []), historialEntry]
          }

          return updatedIncident
        }
        return incident
      }),
    }))
  }

  const setFilters = (filters: Partial<AppState["filters"]>) => {
    setState((prev) => ({
      ...prev,
      filters: { ...prev.filters, ...filters },
    }))
  }

  const setSearchTerm = (term: string) => {
    setState((prev) => ({ ...prev, searchTerm: term }))
  }

  const setSortConfig = (
    config: AppState["sortConfig"] | ((prev: AppState["sortConfig"]) => AppState["sortConfig"]),
  ) => {
    setState((prev) => ({
      ...prev,
      sortConfig: typeof config === "function" ? config(prev.sortConfig) : config,
    }))
  }

  const contextValue: AppContextType = {
    ...state,
    login,
    logout,
    setCurrentView,
    setSelectedIncident,
    addIncident,
    updateIncident,
    setFilters,
    setSearchTerm,
    setSortConfig,
  }

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useAppContext must be used within an AppProvider")
  }
  return context
}
