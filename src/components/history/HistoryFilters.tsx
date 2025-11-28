import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { SelectField, SelectItem } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { useAmbulances } from "@/lib/api/queries"
import type { Incident, EmergencyLevel, AmbulanceStatus } from "@/types"
import { Search, X, Filter } from "lucide-react"
import { cn } from "@/lib/utils"

interface HistoryFiltersProps {
  filters: HistoryFiltersState
  onFiltersChange: (filters: HistoryFiltersState) => void
}

export interface HistoryFiltersState {
  search?: string
  emergencyLevel?: EmergencyLevel[]
  status?: Incident["status"][]
  ambulanceId?: string
  dateFrom?: string
  dateTo?: string
}

export function HistoryFilters({ filters, onFiltersChange }: HistoryFiltersProps) {
  const { data: ambulances = [] } = useAmbulances()
  const [localFilters, setLocalFilters] = useState<HistoryFiltersState>(filters)

  useEffect(() => {
    setLocalFilters(filters)
  }, [filters])

  const handleFilterChange = (key: keyof HistoryFiltersState, value: unknown) => {
    const newFilters = { ...localFilters, [key]: value }
    setLocalFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const handleClearFilters = () => {
    const clearedFilters: HistoryFiltersState = {}
    setLocalFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const hasActiveFilters =
    localFilters.search ||
    (localFilters.emergencyLevel && localFilters.emergencyLevel.length > 0) ||
    (localFilters.status && localFilters.status.length > 0) ||
    localFilters.ambulanceId ||
    localFilters.dateFrom ||
    localFilters.dateTo

  const levelLabels: Record<EmergencyLevel, string> = {
    low: "Faible",
    medium: "Moyenne",
    high: "Élevée",
    critical: "Critique",
  }

  const statusLabels: Record<Incident["status"], string> = {
    pending: "En attente",
    assigned: "Assigné",
    in_progress: "En cours",
    completed: "Terminé",
    cancelled: "Annulé",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filtres
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Search */}
          <div>
            <Label htmlFor="search">Recherche textuelle</Label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Rechercher dans les titres, descriptions..."
                value={localFilters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value || undefined)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label htmlFor="dateFrom">Date de début</Label>
              <Input
                id="dateFrom"
                type="date"
                value={localFilters.dateFrom || ""}
                onChange={(e) => handleFilterChange("dateFrom", e.target.value || undefined)}
                className="mt-1.5"
              />
            </div>
            <div>
              <Label htmlFor="dateTo">Date de fin</Label>
              <Input
                id="dateTo"
                type="date"
                value={localFilters.dateTo || ""}
                onChange={(e) => handleFilterChange("dateTo", e.target.value || undefined)}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Emergency Level */}
          <div>
            <Label>Niveau de gravité</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {(["low", "medium", "high", "critical"] as EmergencyLevel[]).map((level) => {
                const isSelected = localFilters.emergencyLevel?.includes(level)
                return (
                  <Badge
                    key={level}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      isSelected && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      const current = localFilters.emergencyLevel || []
                      const newLevels = isSelected
                        ? current.filter((l) => l !== level)
                        : [...current, level]
                      handleFilterChange("emergencyLevel", newLevels.length > 0 ? newLevels : undefined)
                    }}
                  >
                    {levelLabels[level]}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Status */}
          <div>
            <Label>Statut</Label>
            <div className="flex flex-wrap gap-2 mt-1.5">
              {(["pending", "assigned", "in_progress", "completed", "cancelled"] as Incident["status"][]).map((status) => {
                const isSelected = localFilters.status?.includes(status)
                return (
                  <Badge
                    key={status}
                    variant={isSelected ? "default" : "outline"}
                    className={cn(
                      "cursor-pointer",
                      isSelected && "bg-primary text-primary-foreground"
                    )}
                    onClick={() => {
                      const current = localFilters.status || []
                      const newStatuses = isSelected
                        ? current.filter((s) => s !== status)
                        : [...current, status]
                      handleFilterChange("status", newStatuses.length > 0 ? newStatuses : undefined)
                    }}
                  >
                    {statusLabels[status]}
                  </Badge>
                )
              })}
            </div>
          </div>

          {/* Ambulance */}
          <div>
            <SelectField
              label="Ambulance"
              value={localFilters.ambulanceId || "all"}
              onValueChange={(value) =>
                handleFilterChange("ambulanceId", value === "all" ? undefined : value)
              }
              placeholder="Toutes les ambulances"
            >
              <SelectItem value="all">Toutes les ambulances</SelectItem>
              {ambulances.map((ambulance) => (
                <SelectItem key={ambulance.id} value={ambulance.id}>
                  {ambulance.name} ({ambulance.plateNumber})
                </SelectItem>
              ))}
            </SelectField>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <Button
              variant="secondary"
              onClick={handleClearFilters}
              className="w-full"
            >
              <X className="mr-2 h-4 w-4" />
              Réinitialiser les filtres
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

