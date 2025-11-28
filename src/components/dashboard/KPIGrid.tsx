import { useMemo } from "react"
import { KPICard } from "@/components/ui/card"
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
          value: Math.abs(
            activeIncidents - (statistics.incidentsByStatus.completed || 0)
          ),
          label: "vs terminés",
          isPositive: false,
        },
        icon: <AlertTriangle className="h-4 w-4" />,
      },
      {
        title: "Ambulances disponibles",
        value: availableAmbulances,
        description: `Sur ${totalAmbulances} au total`,
        trend: {
          value: Math.round(
            ((availableAmbulances - (statistics.availableAmbulances || 0)) /
              Math.max(statistics.availableAmbulances || 1, 1)) *
              100
          ),
          label: "vs moyenne",
          isPositive:
            availableAmbulances >= (statistics.availableAmbulances || 0),
        },
        icon: <Truck className="h-4 w-4" />,
      },
      {
        title: "Temps moyen de réponse",
        value: responseTimeFormatted,
        description: "Moyenne sur 24h",
        trend: {
          value: Math.round(
            ((statistics.averageResponseTime - 5) / 5) * 100
          ),
          label: "vs objectif",
          isPositive: statistics.averageResponseTime <= 5,
        },
        icon: <Clock className="h-4 w-4" />,
      },
      {
        title: "Activité totale",
        value: statistics.totalIncidents,
        description: "Interventions aujourd'hui",
        trend: {
          value: Math.round(
            ((statistics.totalIncidents - (statistics.todayStats?.incidentsToday || 0)) /
              Math.max(statistics.todayStats?.incidentsToday || 1, 1)) *
              100
          ),
          label: "vs hier",
          isPositive: true,
        },
        icon: <Activity className="h-4 w-4" />,
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

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, index) => (
        <KPICard
          key={index}
          title={kpi.title}
          value={kpi.value}
          description={kpi.description}
          trend={kpi.trend}
          icon={kpi.icon}
        />
      ))}
    </div>
  )
}

