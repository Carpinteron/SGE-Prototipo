import type React from "react"
import { AppProvider, useApp } from "./context/AppContext"
import { Header } from "./components/Header"
import { Login } from "./components/Login"
import { Dashboard } from "./components/Dashboard"
import { IncidentDetail } from "./components/IncidentDetail"
import { IncidentFormPage } from "./components/IncidentFormPage"
import { IncidentList } from "./components/IncidentList"

const AppContent: React.FC = () => {
  const { user, currentView } = useApp()

  if (!user.authenticated) {
    return <Login />
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="flex-1">
        {currentView === "dashboard" && <Dashboard />}
        {currentView === "incident-detail" && <IncidentDetail />}
        {currentView === "incident-form" && <IncidentFormPage />}
        {currentView === "incident-list" && <IncidentList />}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <div className="size-full">
        <AppContent />
      </div>
    </AppProvider>
  )
}
