import { useLocation, Link } from "react-router-dom"
import { Home, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

const routeLabels: Record<string, string> = {
  "/": "Dashboard",
  "/map": "Carte",
  "/fleet": "Flotte",
  "/incidents": "Historique",
}

export function Breadcrumb() {
  const location = useLocation()
  const pathnames = location.pathname.split("/").filter((x) => x)

  return (
    <nav
      className="border-b border-border/40 bg-muted/30 px-4 sm:px-6 lg:px-8 py-1.5"
      aria-label="Breadcrumb"
    >
      <ol className="flex items-center gap-1.5 text-sm text-muted-foreground">
        <li>
          <Link
            to="/"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
            aria-label="Accueil"
          >
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            <span className="hidden sm:inline">Tableau de bord</span>
          </Link>
        </li>
        {pathnames.length > 0 && (
          <>
            <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/50" aria-hidden="true" />
            <li>
              <span className="text-foreground font-medium">
                {routeLabels[location.pathname] || pathnames[pathnames.length - 1]}
              </span>
            </li>
          </>
        )}
      </ol>
    </nav>
  )
}
