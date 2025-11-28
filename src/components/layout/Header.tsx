import { Bell, User, Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

interface HeaderProps {
  userName?: string
  notificationCount?: number
}

export function Header({ userName = "Utilisateur", notificationCount = 0 }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark")
    setDarkMode(isDark)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }

  return (
    <header
      className="sticky top-0 z-30 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
      role="banner"
    >
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-foreground hidden sm:block">
            Tableau de bord
          </h2>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
            className="h-9 w-9"
          >
            {darkMode ? (
              <Sun className="h-5 w-5" aria-hidden="true" />
            ) : (
              <Moon className="h-5 w-5" aria-hidden="true" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-9 w-9"
            aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} non lues)` : ""}`}
          >
            <Bell className="h-5 w-5" aria-hidden="true" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className={cn(
                  "absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                )}
                aria-label={`${notificationCount} notifications non lues`}
              >
                {notificationCount > 9 ? "9+" : notificationCount}
              </Badge>
            )}
          </Button>

          {/* User menu */}
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:flex sm:flex-col sm:items-end">
              <span className="text-sm font-medium text-foreground">{userName}</span>
              <span className="text-xs text-muted-foreground">Opérateur</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 rounded-full"
              aria-label="Menu utilisateur"
            >
              <User className="h-5 w-5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

