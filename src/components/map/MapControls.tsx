import { useState } from "react"
import { useMap } from "react-leaflet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  ZoomIn,
  ZoomOut,
  Navigation,
  Eye,
  EyeOff,
  Filter,
  X,
} from "lucide-react"
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import {
  selectAmbulanceFilters,
  selectIncidentFilters,
  setAmbulanceFilters,
  setIncidentFilters,
  clearAmbulanceFilters,
  clearIncidentFilters,
} from "@/store/slices/uiSlice"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import type { AmbulanceStatus, EmergencyLevel } from "@/types"

export function MapControls() {
  const map = useMap()
  const dispatch = useAppDispatch()
  const [showFilters, setShowFilters] = useState(false)
  const ambulanceFilters = useAppSelector(selectAmbulanceFilters)
  const incidentFilters = useAppSelector(selectIncidentFilters)

  const handleZoomIn = () => {
    map.zoomIn()
  }

  const handleZoomOut = () => {
    map.zoomOut()
  }

  const handleResetView = () => {
    map.setView([48.8566, 2.3522], 13) // Paris center
  }

  const toggleAmbulanceStatus = (status: AmbulanceStatus) => {
    const currentStatuses = ambulanceFilters.status || []
    const newStatuses = currentStatuses.includes(status)
      ? currentStatuses.filter((s) => s !== status)
      : [...currentStatuses, status]
    
    dispatch(
      setAmbulanceFilters({
        status: newStatuses.length > 0 ? newStatuses : undefined,
      })
    )
  }

  const toggleIncidentLevel = (level: EmergencyLevel) => {
    const currentLevels = incidentFilters.emergencyLevel || []
    const newLevels = currentLevels.includes(level)
      ? currentLevels.filter((l) => l !== level)
      : [...currentLevels, level]
    
    dispatch(
      setIncidentFilters({
        emergencyLevel: newLevels.length > 0 ? newLevels : undefined,
      })
    )
  }

  const hasActiveFilters =
    (ambulanceFilters.status && ambulanceFilters.status.length > 0) ||
    (incidentFilters.emergencyLevel && incidentFilters.emergencyLevel.length > 0)

  const statusOptions: Array<{ value: AmbulanceStatus; label: string }> = [
    { value: "available", label: "Disponible" },
    { value: "busy", label: "Occupée" },
    { value: "maintenance", label: "Maintenance" },
    { value: "offline", label: "Hors ligne" },
  ]

  const levelOptions: Array<{ value: EmergencyLevel; label: string }> = [
    { value: "low", label: "Faible" },
    { value: "medium", label: "Moyenne" },
    { value: "high", label: "Élevée" },
    { value: "critical", label: "Critique" },
  ]

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      {/* Zoom Controls */}
      <div className="flex flex-col gap-1 bg-background rounded-lg shadow-lg border border-border p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomIn}
          className="h-8 w-8"
          aria-label="Zoom avant"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleZoomOut}
          className="h-8 w-8"
          aria-label="Zoom arrière"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleResetView}
          className="h-8 w-8"
          aria-label="Réinitialiser la vue"
        >
          <Navigation className="h-4 w-4" />
        </Button>
      </div>

      {/* Filter Toggle */}
      <Button
        variant="default"
        size="sm"
        onClick={() => setShowFilters(!showFilters)}
        className="relative"
        aria-label="Afficher les filtres"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtres
        {hasActiveFilters && (
          <Badge
            variant="destructive"
            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            !
          </Badge>
        )}
      </Button>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="w-64 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Filtres d'affichage</CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowFilters(false)}
                className="h-6 w-6"
                aria-label="Fermer les filtres"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Ambulance Status Filters */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">
                Statut des ambulances
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {statusOptions.map((option) => {
                  const isActive =
                    ambulanceFilters.status?.includes(option.value) || false
                  return (
                    <Button
                      key={option.value}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleAmbulanceStatus(option.value)}
                      className="h-7 text-xs"
                    >
                      {isActive ? (
                        <Eye className="h-3 w-3 mr-1" />
                      ) : (
                        <EyeOff className="h-3 w-3 mr-1" />
                      )}
                      {option.label}
                    </Button>
                  )
                })}
              </div>
              {ambulanceFilters.status && ambulanceFilters.status.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => dispatch(clearAmbulanceFilters())}
                  className="h-6 text-xs w-full"
                >
                  Réinitialiser
                </Button>
              )}
            </div>

            {/* Incident Level Filters */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">
                Niveau d'urgence
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {levelOptions.map((option) => {
                  const isActive =
                    incidentFilters.emergencyLevel?.includes(option.value) ||
                    false
                  return (
                    <Button
                      key={option.value}
                      variant={isActive ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleIncidentLevel(option.value)}
                      className="h-7 text-xs"
                    >
                      {isActive ? (
                        <Eye className="h-3 w-3 mr-1" />
                      ) : (
                        <EyeOff className="h-3 w-3 mr-1" />
                      )}
                      {option.label}
                    </Button>
                  )
                })}
              </div>
              {incidentFilters.emergencyLevel &&
                incidentFilters.emergencyLevel.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => dispatch(clearIncidentFilters())}
                    className="h-6 text-xs w-full"
                  >
                    Réinitialiser
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

