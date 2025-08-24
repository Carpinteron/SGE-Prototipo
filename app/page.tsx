"use client"
import { Header } from "@/components/Header"
import { Login } from "@/components/Login"
import { Dashboard } from "@/components/Dashboard"
import { IncidentDetail } from "@/components/IncidentDetail"
import { IncidentForm } from "@/components/IncidentForm"
import { Footer } from "@/components/Footer"
import { AppProvider, useAppContext } from "@/context/AppContext"

function AppContent() {
  const { user, currentView } = useAppContext()

  if (!user.authenticated) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 pb-16">
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "incident-detail" && <IncidentDetail />}
        {currentView === "incident-form" && <IncidentForm />}
      </main>
      <Footer />
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
