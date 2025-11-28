import { useMemo } from "react"
import { KPICard } from "@/components/dashboard/KPICard"
import { AlertTriangle, Truck, Clock, Activity } from "lucide-react"
import { useStatistics } from "@/lib/api/queries"
import { useAmbulances } from "@/lib/api/queries"
import { useIncidents } from "@/lib/api/queries"
import { Loader2 } from "lucide-react"

export function KPIGrid() {
  const { data: statistics, isLoading: loadingStats } = useStatistics()
  const { data: ambulances = [], isLoading: loadingAmbulances } = useAmbulances()
  const { data: incidents = [], isLoading: loadingIncidents } = useIncidents()

  const isLoading = loadingStats || loadingAmbulances || loadingIncidents

  const kpis = useMemo(() => {
    if (!statistics) {
      return []
    }

    const activeIncidents = incidents.filter(
      (incident) =>
        incident.status === "pending" ||
        incident.status === "assigned" ||
        incident.status === "in_progress"
    ).length

    const availableAmbulances = ambulances.filter(
      (ambulance) => ambulance.status === "available"
    ).length

    const totalAmbulances = ambulances.length

    // Calculate average response time in minutes
    const avgResponseTimeMinutes = Math.floor(statistics.averageResponseTime)
    const avgResponseTimeSeconds = Math.floor(
      (statistics.averageResponseTime - avgResponseTimeMinutes) * 60
    )
    const responseTimeFormatted = `${avgResponseTimeMinutes}m ${avgResponseTimeSeconds}s`

    return [
      {
        title: "Incidents actifs",
        value: activeIncidents,
        description: "En cours de traitement",
        trend: {
          value: String(Math.abs(
            activeIncidents - (statistics.incidentsByStatus?.completed || 0)
          )) + "%",
          period: "terminés",
          isPositive: false,
        },
        icon: AlertTriangle,
      },
      {
        title: "Ambulances disponibles",
        value: availableAmbulances,
        description: `Sur ${totalAmbulances} au total`,
        trend: {
          value: String(Math.round(
            ((availableAmbulances - (statistics.availableAmbulances || 0)) /
              Math.max(statistics.availableAmbulances || 1, 1)) *
              100
          )) + "%",
          period: "moyenne",
          isPositive:
            availableAmbulances >= (statistics.availableAmbulances || 0),
        },
        icon: Truck,
      },
      {
        title: "Temps moyen de réponse",
        value: responseTimeFormatted,
        description: "Moyenne sur 24h",
        trend: {
          value: String(Math.round(
            ((statistics.averageResponseTime - 5) / 5) * 100
          )) + "%",
          period: "objectif",
          isPositive: statistics.averageResponseTime <= 5,
        },
        icon: Clock,
      },
      {
        title: "Activité totale",
        value: statistics.totalIncidents || 0,
        description: "Interventions aujourd'hui",
        trend: {
          value: String(Math.round(
            ((statistics.totalIncidents - (statistics.todayStats?.incidentsToday || 0)) /
              Math.max(statistics.todayStats?.incidentsToday || 1, 1)) *
              100
          )) + "%",
          period: "hier",
          isPositive: true,
        },
        icon: Activity,
      },
    ]
  }, [statistics, ambulances, incidents])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-muted animate-pulse rounded-lg"
            aria-label="Chargement..."
          />
        ))}
      </div>
    )
  }

  if (kpis.length === 0) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-32 bg-gray-100 animate-pulse rounded-lg"
            aria-label="Chargement..."
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpis.map((kpi, index) => {
        const Icon = kpi.icon
        return (
          <KPICard
            key={index}
            title={kpi.title}
            value={kpi.value}
            label={kpi.description}
            trend={kpi.trend}
            icon={Icon}
          />
        )
      })}
    </div>
  )
}

