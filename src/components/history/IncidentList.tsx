import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import type { SortableColumn } from "@/components/ui/table"
import { StatusBadge } from "@/components/incidents/StatusBadge"
import { Badge } from "@/components/ui/badge"
import type { Incident } from "@/types"
import { Calendar, MapPin, Clock, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface IncidentListProps {
  incidents: Incident[]
  loading?: boolean
  onSelectIncident?: (incident: Incident) => void
  selectedIncidentId?: string | null
}

export function IncidentList({
  incidents,
  loading = false,
  onSelectIncident,
  selectedIncidentId,
}: IncidentListProps) {
  const [sortKey, setSortKey] = useState<keyof Incident | string | undefined>("reportedAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc" | null>("desc")

  const handleSort = (key: keyof Incident | string, direction: "asc" | "desc" | null) => {
    setSortKey(key)
    setSortDirection(direction)
  }

  // Sort data
  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return incidents

    return [...incidents].sort((a, b) => {
      const aValue = a[sortKey as keyof Incident]
      const bValue = b[sortKey as keyof Incident]

      if (aValue === undefined || aValue === null) return 1
      if (bValue === undefined || bValue === null) return -1

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      if (aValue instanceof Date || bValue instanceof Date) {
        const aDate = new Date(aValue as string | Date)
        const bDate = new Date(bValue as string | Date)
        return sortDirection === "asc"
          ? aDate.getTime() - bDate.getTime()
          : bDate.getTime() - aDate.getTime()
      }

      return 0
    })
  }, [incidents, sortKey, sortDirection])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: date.toLocaleTimeString("fr-FR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    }
  }

  const getDuration = (incident: Incident) => {
    if (!incident.startedAt || !incident.completedAt) return null
    const start = new Date(incident.startedAt)
    const end = new Date(incident.completedAt)
    const diffMs = end.getTime() - start.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    return diffMins
  }

  const levelLabels: Record<Incident["emergencyLevel"], string> = {
    low: "Faible",
    medium: "Moyenne",
    high: "Élevée",
    critical: "Critique",
  }

  const columns: SortableColumn<Incident>[] = [
    {
      key: "reportedAt",
      label: "Date",
      sortable: true,
      render: (value, row) => {
        const { date, time } = formatDate(row.reportedAt)
        return (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">{date}</div>
              <div className="text-xs text-muted-foreground">{time}</div>
            </div>
          </div>
        )
      },
    },
    {
      key: "title",
      label: "Incident",
      sortable: true,
      render: (value, row) => (
        <div className="space-y-1">
          <div className="font-medium">{row.title}</div>
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            {row.location.address}
          </div>
        </div>
      ),
    },
    {
      key: "emergencyLevel",
      label: "Gravité",
      sortable: true,
      render: (value, row) => (
        <Badge
          variant={
            row.emergencyLevel === "low"
              ? "emergencyLow"
              : row.emergencyLevel === "medium"
              ? "emergencyMedium"
              : row.emergencyLevel === "high"
              ? "emergencyHigh"
              : "emergencyCritical"
          }
        >
          {levelLabels[row.emergencyLevel]}
        </Badge>
      ),
    },
    {
      key: "status",
      label: "Statut",
      sortable: true,
      render: (value, row) => <StatusBadge status={row.status} />,
    },
    {
      key: "completedAt",
      label: "Durée",
      sortable: false,
      render: (value, row) => {
        const duration = getDuration(row)
        if (!duration) return <span className="text-muted-foreground">-</span>
        return (
          <div className="flex items-center gap-1 text-sm">
            <Clock className="h-3 w-3 text-muted-foreground" />
            <span>{duration} min</span>
          </div>
        )
      },
    },
  ]

  return (
    <div className="space-y-2">
      {sortedData.map((incident) => {
        const isSelected = selectedIncidentId === incident.id
        const { date, time } = formatDate(incident.reportedAt)

        return (
          <Card
            key={incident.id}
            className={cn(
              "cursor-pointer transition-all hover:shadow-md",
              isSelected && "ring-2 ring-primary"
            )}
            onClick={() => onSelectIncident?.(incident)}
          >
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">{incident.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {incident.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          incident.emergencyLevel === "low"
                            ? "emergencyLow"
                            : incident.emergencyLevel === "medium"
                            ? "emergencyMedium"
                            : incident.emergencyLevel === "high"
                            ? "emergencyHigh"
                            : "emergencyCritical"
                        }
                      >
                        {levelLabels[incident.emergencyLevel]}
                      </Badge>
                      <StatusBadge status={incident.status} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="font-medium">{date}</div>
                        <div className="text-xs text-muted-foreground">{time}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground truncate">
                        {incident.location.address}
                      </span>
                    </div>
                    {incident.assignedAmbulanceId && (
                      <div className="text-sm">
                        <span className="text-muted-foreground">Ambulance: </span>
                        <span className="font-medium">{incident.assignedAmbulanceId}</span>
                      </div>
                    )}
                    {getDuration(incident) && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">
                          Durée: <span className="font-medium">{getDuration(incident)} min</span>
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
              </div>
            </CardContent>
          </Card>
        )
      })}

      {!loading && sortedData.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Aucun incident trouvé</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="text-muted-foreground mt-2">Chargement...</p>
        </div>
      )}
    </div>
  )
}

