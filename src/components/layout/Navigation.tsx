import { NavLink } from "react-router-dom"
import { 
  LayoutDashboard, 
  Map, 
  Truck, 
  History,
  Menu,
  X 
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface NavigationProps {
  isOpen: boolean
  onToggle: () => void
  isMobile?: boolean
}

const navigationItems = [
  {
    path: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
  },
  {
    path: "/map",
    label: "Carte",
    icon: Map,
  },
  {
    path: "/fleet",
    label: "Flotte",
    icon: Truck,
  },
  {
    path: "/incidents",
    label: "Historique",
    icon: History,
  },
]

export function Navigation({ isOpen, onToggle, isMobile = false }: NavigationProps) {
  return (
    <>
      {/* Mobile menu button */}
      {isMobile && (
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden fixed top-4 left-4 z-50"
          onClick={onToggle}
          aria-label={isOpen ? "Fermer le menu" : "Ouvrir le menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? (
            <X className="h-6 w-6" aria-hidden="true" />
          ) : (
            <Menu className="h-6 w-6" aria-hidden="true" />
          )}
        </Button>
      )}

      {/* Overlay for mobile */}
      {isMobile && isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <nav
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border transform transition-transform duration-300 ease-in-out lg:translate-x-0",
          isMobile && (isOpen ? "translate-x-0" : "-translate-x-full"),
          !isMobile && "translate-x-0"
        )}
        aria-label="Navigation principale"
      >
        <div className="flex flex-col h-full">
          {/* Logo/Brand */}
          <div className="flex items-center justify-between h-16 px-6 border-b border-border">
            <h1 className="text-xl font-bold text-foreground">ResQ</h1>
            {isMobile && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onToggle}
                aria-label="Fermer le menu"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </Button>
            )}
          </div>

          {/* Navigation links */}
          <div className="flex-1 overflow-y-auto py-4">
            <ul className="space-y-1 px-3" role="list">
              {navigationItems.map((item) => {
                const Icon = item.icon
                return (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      end={item.path === "/"}
                      onClick={() => isMobile && onToggle()}
                      className={({ isActive }) =>
                        cn(
                          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "text-muted-foreground"
                        )
                      }
                      aria-current={({ isActive }) => (isActive ? "page" : undefined)}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </nav>
    </>
  )
}

