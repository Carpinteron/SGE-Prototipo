"use client"
import { Header } from "@/components/Header"
import { Login } from "@/components/Login"
import { Dashboard } from "@/components/Dashboard"
import { IncidentDetail } from "@/components/IncidentDetail"
import { IncidentForm } from "@/components/IncidentForm"
import { AppProvider, useAppContext } from "@/context/AppContext"

function AppContent() {
  const { user, currentView } = useAppContext()

  if (!user.authenticated) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "incident-detail" && <IncidentDetail />}
        {currentView === "incident-form" && <IncidentForm />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  )
}
