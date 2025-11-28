import { Bell, User, Moon, Sun, Search, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface HeaderProps {
  userName?: string
  notificationCount?: number
}

export function Header({ userName = "Utilisateur", notificationCount = 0 }: HeaderProps) {
  const [darkMode, setDarkMode] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

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
    <header className="h-[60px] bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="flex items-center justify-between h-full px-4 py-2">
        {/* Left side - Search */}
        <div className="flex items-center gap-2 flex-1 max-w-md">
          {showSearch ? (
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Rechercher..."
                className="pl-8 pr-8 h-8 text-sm border-gray-300"
                autoFocus
                onBlur={() => setShowSearch(false)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6"
                onClick={() => setShowSearch(false)}
              >
                ×
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSearch(true)}
              className="gap-1.5 h-8 px-2 text-gray-600 hover:text-gray-900 text-sm"
            >
              <Search className="h-3.5 w-3.5" />
              <span className="hidden sm:inline text-xs">Rechercher...</span>
            </Button>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1">
          {/* Dark mode toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
            aria-label={darkMode ? "Activer le mode clair" : "Activer le mode sombre"}
            className="h-8 w-8 text-gray-600 hover:text-gray-900"
          >
            {darkMode ? (
              <Sun className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative h-8 w-8 text-gray-600 hover:text-gray-900"
            aria-label={`Notifications${notificationCount > 0 ? ` (${notificationCount} non lues)` : ""}`}
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {notificationCount > 0 && (
              <Badge
                variant="destructive"
                className={cn(
                  "absolute -top-0.5 -right-0.5 h-4 w-4 flex items-center justify-center p-0 text-[10px] font-semibold bg-red-600"
                )}
                aria-label={`${notificationCount} notifications non lues`}
              >
                {notificationCount > 9 ? "9+" : notificationCount}
              </Badge>
            )}
          </Button>

          {/* Settings */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-gray-600 hover:text-gray-900"
            aria-label="Paramètres"
          >
            <Settings className="h-4 w-4" aria-hidden="true" />
          </Button>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-8 px-2 gap-1.5 hover:bg-gray-100"
                aria-label="Menu utilisateur"
              >
                <div className="h-7 w-7 rounded-full bg-blue-600 flex items-center justify-center">
                  <User className="h-3.5 w-3.5 text-white" aria-hidden="true" />
                </div>
                <div className="hidden sm:flex sm:flex-col sm:items-start">
                  <span className="text-xs font-semibold text-gray-900 leading-tight">
                    {userName}
                  </span>
                  <span className="text-[10px] text-gray-600 leading-tight">
                    Opérateur
                  </span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Mon compte</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Profil</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                <span>Paramètres</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <span>Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
