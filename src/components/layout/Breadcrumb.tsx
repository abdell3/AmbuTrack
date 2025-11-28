import { Link, useLocation } from "react-router-dom"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
  label: string
  path?: string
}

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/map": "Carte",
  "/fleet": "Flotte",
  "/incidents": "Historique",
}

export function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  const breadcrumbs: BreadcrumbItem[] = [
    { label: "Accueil", path: "/" },
    ...pathnames.map((value, index) => {
      const to = `/${pathnames.slice(0, index + 1).join("/")}`
      return {
        label: routeLabels[to] || value.charAt(0).toUpperCase() + value.slice(1),
        path: to,
      }
    }),
  ]

  // Don't show breadcrumb on home page
  if (location.pathname === "/") {
    return null
  }

  return (
    <nav
      aria-label="Fil d'Ariane"
      className="flex items-center space-x-1 sm:space-x-2 text-sm text-muted-foreground px-4 sm:px-6 lg:px-8 py-3"
    >
      <ol className="flex items-center space-x-1 sm:space-x-2" role="list">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1
          return (
            <li key={crumb.path || "current"} className="flex items-center" role="listitem">
              {index === 0 ? (
                <Link
                  to={crumb.path || "/"}
                  className="flex items-center hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                  aria-label="Retour à l'accueil"
                >
                  <Home className="h-4 w-4" aria-hidden="true" />
                  <span className="sr-only">Accueil</span>
                </Link>
              ) : isLast ? (
                <span
                  className="text-foreground font-medium"
                  aria-current="page"
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  to={crumb.path || "#"}
                  className="hover:text-foreground transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
                >
                  {crumb.label}
                </Link>
              )}
              {!isLast && (
                <ChevronRight
                  className="h-4 w-4 mx-1 sm:mx-2 text-muted-foreground"
                  aria-hidden="true"
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

