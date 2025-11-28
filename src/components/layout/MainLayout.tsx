import { useState, useEffect } from "react"
import { Outlet, useLocation } from "react-router-dom"
import { Navigation } from "./Navigation"
import { Header } from "./Header"
import { Breadcrumb } from "./Breadcrumb"

export function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  useEffect(() => {
    // Close sidebar on mobile when route changes
    if (isMobile) {
      setSidebarOpen(false)
    }
  }, [location.pathname, isMobile])

  useEffect(() => {
    // Update document title based on current route
    const routeTitles: Record<string, string> = {
      "/": "Dashboard - ResQ",
      "/map": "Carte de dispatch - ResQ",
      "/fleet": "Gestion flotte - ResQ",
      "/incidents": "Historique incidents - ResQ",
    }

    document.title = routeTitles[location.pathname] || "ResQ"
  }, [location.pathname])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        isMobile={isMobile}
      />
      <div className="flex-1 flex flex-col lg:pl-64">
        <Header />
        <Breadcrumb />
        <main
          className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8"
          role="main"
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}

